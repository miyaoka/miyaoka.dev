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

  const [transitionNames, setTransitionNames] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el || el.complete) return

    // mount時にcompleteしていなければtransitionをつける
    setTransitionNames('opacity-0 scale-50 rotate-90')
    // onloadで解除してアニメーション
    el.onload = () => setTransitionNames('')
  }, [])

  return (
    <img
      src={src}
      className={`rounded-full transform transition-all duration-300 ${transitionNames}`}
      loading="lazy"
      title={title}
      ref={ref}
    />
  )
}
