import React, { useEffect } from 'react'
import { getThumbPath } from '../lib/imgur'

const transformClasses = ['opacity-0', 'scale-50', 'rotate-90']
const transformClassesStr = transformClasses.join(' ')

export default function ThumbImg({
  image,
  title,
}: {
  image: string
  title: string
}) {
  const src = getThumbPath(image)
  const ref = React.createRef<HTMLImageElement>()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const resetTransform = () => {
      el.classList.remove(...transformClasses)
    }

    // mount時にload完了している場合はonLoadが発火しないのでcompleteで発火させる
    if (el.complete) {
      resetTransform()
      return
    }
    el.onload = resetTransform
  }, [])

  return (
    <img
      src={src}
      className={`rounded-full transition-all duration-300 transform ${transformClassesStr} `}
      loading="lazy"
      title={title}
      ref={ref}
    />
  )
}
