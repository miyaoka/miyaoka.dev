const imgurHost = `https://i.imgur.com/`
const imgurRegXp = new RegExp(`${imgurHost}(.+)\\.([^.]+)`)

export const thumbMap = {
  s: 90,
  b: 160,
  t: 160,
  m: 320,
  l: 640,
  h: 1024,
} as const

export const getImgurSrc = (path: string) => {
  const matched = path.match(imgurRegXp)
  if (matched == null) return null
  const [_, id, ext] = matched
  return { id, ext }
}

export const getImgurThumb = (
  id: string,
  type: keyof typeof thumbMap,
  ext: string = 'webp'
) => {
  return `${imgurHost}${id}${type}.${ext}`
}

export const getThumbPath = (imgPath: string) => {
  const imgurSrc = getImgurSrc(imgPath)
  if (imgurSrc == null) return imgPath

  const { id, ext } = imgurSrc
  // md→html化でlをつけてしまうので取り除く
  const removedSuffixId = id.replace(/l$/, '')
  return getImgurThumb(removedSuffixId, 'b', ext)
}
