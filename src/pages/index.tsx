import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getTagCountMap, getSortedPostsData } from '../lib/posts'
import Layout from '../components/layout'
import DateTime from '../components/dateTime'
import site from '../site.config.json'
import { getThumbPath } from '../lib/imgur'
import { TagLink } from '../components/tag'

const linkList = [
  {
    title: 'Twitter',
    url: 'https://twitter.com/miyaoka',
    src: 'twitter',
  },
  {
    title: 'GitHub',
    url: 'https://github.com/miyaoka/miyaoka.dev',
    src: 'github',
  },
  {
    title: 'RSS',
    url: site.feedPath,
    src: 'rss',
  },
]

export const config = {
  unstable_runtimeJS: false,
}

export default function Home({
  allPostsMetaData,
  allPostTags,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout home>
      <Head>
        <title>{site.title}</title>
        <link rel="canonical" href={site.host}></link>
      </Head>
      <div className="inline-grid grid-flow-col gap-x-2" title="profile">
        {linkList.map(({ title, url, src }) => {
          return (
            <a
              key={url}
              href={url}
              title={title}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-4"
            >
              <div
                className="h-8 w-8  bg-red-300"
                style={{
                  WebkitMask: `url(/images/${src}.svg) no-repeat center / contain`,
                }}
              />
            </a>
          )
        })}
      </div>

      <section className="mt-20">
        <div className="flex flex-wrap gap-1 text-sm">
          {allPostTags.map(([tag, count]) => TagLink({ tag, count }))}
        </div>
      </section>
      <section className="mt-10">
        <ul className="grid gap-y-6">
          {allPostsMetaData.map(({ id, date, title, desc, image, tags }) => (
            <li key={id} className="flex">
              <div className="thumb flex flex-shrink-0 mt-4 mr-5">
                {image && (
                  <Link href={`/posts/${id}`}>
                    <a className="w-full">
                      <miyaoka-img-loader
                        class="w-full h-full block border box-content border-gray-400 bg-gray-100 rounded-[42%] relative z-0 hydrated"
                        src={getThumbPath(image)}
                      ></miyaoka-img-loader>
                    </a>
                  </Link>
                )}
              </div>
              <div className="flex  flex-1 flex-col gap-2">
                <Link href={`/posts/${id}`}>
                  <a className="flex flex-col flex-1" data-prefetch>
                    <small className="text-gray-500">
                      <DateTime dateString={date} />
                    </small>
                    <h2 className="text-lg font-bold">{title}</h2>
                    {desc && (
                      <div className="text-gray-500 text-sm leading-snug">
                        {desc}
                      </div>
                    )}
                  </a>
                </Link>

                {tags && (
                  <div className="flex gap-1 text-sm">
                    {tags.map((tag) => TagLink({ tag }))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = await getSortedPostsData()
  const tagCountMap = await getTagCountMap()
  const allPostTags = Object.entries(tagCountMap).sort((a, b) => b[1] - a[1])

  // reduce state data
  const allPostsMetaData = allPostsData.map((post) => {
    const { contentHtml, ...metaData } = post
    return metaData
  })

  return {
    props: {
      allPostsMetaData,
      allPostTags,
    },
  }
}
