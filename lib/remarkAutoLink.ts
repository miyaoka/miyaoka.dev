import isUrl from 'is-url'
import visit from 'unist-util-visit-parents'
import convert from 'unist-util-is/convert'
import { Node } from 'unist'

const isAbsolutePath = (value: string) => value.startsWith('/')
const isRelativePath = (value: string) =>
  value.startsWith('./') || value.startsWith('../')
const isImgPath = (value: string) => isAbsolutePath(value) || isRelativePath(value)
// @ts-ignore
const isInteractive = convert(['link', 'linkReference'])

export const links = () => {
  return transform
}

function transform(tree: Node) {
  visit(tree, 'text', ontext)
}

function ontext<V extends Node>(node: V,
  parents: Node[]) {
  const value = String(node.value).trim()

  const lines = value.split('\n')

  if (lines.length > 2) return
  const [linkPath, caption] = lines

  if ((isUrl(linkPath) || isImgPath(linkPath))) {
    let interactive = false
    let length = parents.length
    const siblings = parents[length - 1].children as Node[]

    // Check if we’re in interactive content.
    while (length--) {
      if (isInteractive(parents[length])) {
        interactive = true
        break
      }
    }
    if (interactive) return

    const link = {
      type: 'html',
      position: node.position,
      value: `<a href="${linkPath}" target="_blank" rel="noopener">${caption ?? linkPath}</a>`
    }

    siblings[siblings.indexOf(node)] = link
  }
}