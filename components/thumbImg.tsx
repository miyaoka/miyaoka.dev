import { useEffect, useState } from 'react'
import { getThumbPath } from '../lib/imgur'

export default function ThumbImg({
  image,
  title,
}: {
  image: string
  title: string
}) {
  const thumbUrl = getThumbPath(image)

  // imgがload済みだとonLoadによるtransformがresetされない
  // 確実にonLoadを発生させるため、src初期値を空にする
  const [src, setSrc] = useState('')
  useEffect(() => {
    setSrc(thumbUrl)
  }, [])

  return (
    <img
      src={src}
      className="thumb rounded-full transition-all duration-300 transform opacity-0 scale-50 rotate-90"
      loading="lazy"
      title={title}
      onLoad={(ev) =>
        (ev.target as HTMLImageElement).classList.remove(
          'opacity-0',
          'scale-50',
          'rotate-90'
        )
      }
    />
  )
}
