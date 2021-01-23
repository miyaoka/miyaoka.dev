import { useEffect, useState } from 'react'
import { getAllPostIds } from '../../lib/posts'

export default function Home() {
  // const res = await fetch(`/api/posts`).then((res) => res.json())

  const [postList, setPostList] = useState([])
  useEffect(() => {
    const fn = async () => {
      const res = await fetch(`/api/posts`).then((res) => res.json())
      setPostList(res.postList)
    }
    fn()
  }, [])

  return (
    <div>
      admin index
      <ul>
        {postList.map((item) => {
          return <li key={item.slug}>{item.title}</li>
        })}
      </ul>
    </div>
  )
}
