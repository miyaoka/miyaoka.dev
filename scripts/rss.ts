import fs from 'fs'
import RSS from 'rss'
import { getSortedPostsData } from '../lib/posts'
import site from '../site.config.json'
import { getThumbPath } from '../lib/imgur'
import { parseISO } from 'date-fns'

async function generate() {
  const allPostsData = await getSortedPostsData()

  const feed = new RSS({
    title: site.title,
    description: site.desc,
    feed_url: `${site.host}${site.feedPath}`,
    site_url: `${site.host}/`,
    image_url: `${site.host}/ogp.png`,
    language: 'ja',
    custom_namespaces: {
      media: 'http://search.yahoo.com/mrss/',
    },
  })

  allPostsData.forEach((post) => {
    const custom_elements = []
    if (post.image != null) {
      custom_elements.push({
        'media:thumbnail': getThumbPath(post.image),
      })
    }
    feed.item({
      title: post.title,
      description: post.desc || '',
      url: `${site.host}${site.postsDir}/${post.id}`,
      date: parseISO(post.date).toUTCString(),
      custom_elements,
    })
  })

  const rss = feed.xml({ indent: true })
  fs.writeFileSync(`./public${site.feedPath}`, rss)
}

generate()
