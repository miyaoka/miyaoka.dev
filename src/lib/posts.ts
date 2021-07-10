import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import remark from 'remark'
import html from 'remark-html'
import { images } from './remarkFigure'
import { links } from './remarkAutoLink'
import { tweet } from './remarkTweet'
import externalLinks from 'remark-external-links'
import config from '../site.config.json'

const { postsDir } = config
const postsDirectory = path.join(process.cwd(), postsDir)

const getAllPostData = async (): Promise<PostItem[]> => {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  return Promise.all(
    fileNames.map(async (fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '')
      return await getPostData(id)
    })
  )
}

export async function getSortedPostsData() {
  const allPostsData = await getAllPostData()

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

type TagCountMap = Record<string, number>
export const getTagCountMap = async (): Promise<TagCountMap> => {
  const allPostsData = await getAllPostData()
  const tagCountMap = allPostsData.reduce((acc: TagCountMap, post) => {
    post.tags?.forEach((tag) => {
      acc[tag] = acc[tag] === undefined ? 1 : acc[tag] + 1
    })
    return acc
  }, {})
  return tagCountMap
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ''))
}

type PostItem = {
  id: string
  title: string
  date: string
  contentHtml: string
  desc?: string
  image?: string
  tags?: string[]
}

export async function getPostData(id: string) {
  // Read markdown file as string
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents, {
    engines: {
      // Disable date parsing
      // https://github.com/jonschlinkert/gray-matter/issues/62
      // @ts-ignore
      yaml: (str) => yaml.safeLoad(str, { schema: yaml.JSON_SCHEMA }),
    },
  })
  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(images)
    .use(tweet)
    .use(links)
    .use(externalLinks, { target: '_blank', rel: ['noopener'] })
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()
  const firstParagraph = contentHtml.match(/<p>(.+)?<\/p>/)
  const firstImg = contentHtml.match(/<img.*?src="([^"]+)"/)

  let contentDesc: Record<string, string> = {}
  if (firstParagraph) {
    contentDesc.desc = firstParagraph[1].replace(/<[^>]*>/g, '')
  }
  if (firstImg) {
    contentDesc.image = firstImg[1]
  }
  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...contentDesc,
    ...matterResult.data,
  } as PostItem
}
