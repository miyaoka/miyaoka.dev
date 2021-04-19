import React, { useEffect, useState } from 'react'
import { getThumbPath } from '../lib/imgur'

export default function ThumbImg({
  image,
  title,
}: {
  image: string
  title: string
}) {
  const src = getThumbPath(image)
  const ref = React.createRef<HTMLImageElement>()

  // initial Transform
  const [classNames, setClassNames] = useState('opacity-0 scale-0 rotate-90')
  const resetTransform = () => setClassNames('')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // mount時にload完了している場合はonLoadが発火しないのでcompleteで発火させる
    if (el.complete) {
      requestAnimationFrame(resetTransform)
      return
    }
    el.onload = resetTransform
  }, [])

  return (
    <img
      src={src}
      className={`rounded-full transform transition-all duration-200 delay-75 ${classNames}`}
      loading="lazy"
      title={title}
      ref={ref}
    />
  )
}
