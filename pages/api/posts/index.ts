import { NextApiRequest, NextApiResponse } from 'next'
import { getSortedPostsData } from '../../../lib/posts'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')

  const postList = await getSortedPostsData()
  res.end(JSON.stringify({ postList }))
}
