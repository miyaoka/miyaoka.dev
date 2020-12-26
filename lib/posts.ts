import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import { images } from './remarkFigure'
import { links } from './remarkAutoLink'
import externalLinks from 'remark-external-links'

const postsDirectory = path.join(process.cwd(), 'posts')

export async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '')

      const { contentHtml, ...metaData } = await getContent(fileName)
      // Combine the data with the id
      return {
        id,
        ...(metaData as {
          date: string
        }),
      }
    })
  )

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    }
  })
}

export async function getPostData(id: string) {
  return {
    id,
    ...(await getContent(`${id}.md`)),
  }
}

async function getContent(fileName: string) {
  // Read markdown file as string
  const fullPath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)
  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(images)
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
    contentHtml,
    ...contentDesc,
    ...matterResult.data,
  }
}
