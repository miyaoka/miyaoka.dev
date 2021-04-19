import { NextApiRequest, NextApiResponse } from 'next'
import { getPostData } from '../../../lib/posts'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')

  const {
    query: { id },
  } = req
  const postData = await getPostData(id as string)
  res.end(JSON.stringify({ postData }))
}
