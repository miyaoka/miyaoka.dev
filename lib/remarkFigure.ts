import isUrl from 'is-url'
import visit from 'unist-util-visit-parents'
import convert from 'unist-util-is/convert'
import { Node } from 'unist'

const isImgExt = (value: string) => /\.(svg|png|jpg|jpeg|gif)$/.test(value)
const isAbsolutePath = (value: string) => value.startsWith('/')
const isRelativePath = (value: string) =>
  value.startsWith('./') || value.startsWith('../')
const isImgPath = (value: string) =>
  isAbsolutePath(value) || isRelativePath(value)

// @ts-ignore
const isInteractive = convert(['link', 'linkReference'])

export const images = () => {
  return transform
}

function transform(tree: Node) {
  visit(tree, 'text', ontext)
}

const isParentInteractive = (parents: Node[]): boolean => {
  let length = parents.length
  // Check if we’re in interactive content.
  while (length--) {
    if (isInteractive(parents[length])) {
      return true
    }
  }
  return false
}

const getOptimizedPath = (imgPath: string) => {
  const matched = imgPath.match(/^(https:\/\/i\.imgur\.com\/)(.+)(\.[^.]+)/)
  if (matched == null) return { imgSrc: imgPath }
  const [_, host, imgId, ext] = matched
  const size1x = 'l'
  const size2x = 'h'
  return {
    imgSrc: `${host}${imgId}${size1x}${ext}`,
    srcset: `${host}${imgId}${size1x}.webp 1x,${host}${imgId}${size2x}.webp 2x`,
  }
}

const getPicture = (imgSrc: string, srcset?: string, caption?: string) => {
  const imgTag = `<img src="${imgSrc}" title="${caption ?? ''
    }" loading="lazy" style="min-height:480px" onload="this.style.minHeight='auto'">`

  if (srcset == null) return imgTag
  return `<picture>
<source type="image/webp"
        srcset="${srcset}">
${imgTag}
</picture>`
}

const getImg = (imgPath: string, inLink: boolean, caption?: string) => {
  const { imgSrc, srcset } = getOptimizedPath(imgPath)
  const picture = getPicture(imgSrc, srcset, caption)

  if (inLink) return picture
  return `<a href="${imgPath}" target="_blank" rel="noopener">${picture}</a>`
}

function ontext<V extends Node>(node: V, parents: Node[]) {
  const value = String(node.value).trim()

  const lines = value.split('\n')

  if (lines.length > 2) return
  const [imgPath, caption] = lines

  if ((isUrl(imgPath) || isImgPath(imgPath)) && isImgExt(imgPath)) {
    const siblings = parents[parents.length - 1].children as Node[]

    // Check if we’re in interactive content.
    const interactive = isParentInteractive(parents)

    const img = getImg(imgPath, interactive, caption)

    const figCaption =
      caption != null ? `<figcaption>${caption}</figcaption>` : ''

    const figure = {
      type: 'html',
      position: node.position,
      value: `<figure>${img}${figCaption}</figure>`,
    }

    siblings[siblings.indexOf(node)] = figure
  }
}
