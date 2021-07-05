import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'
import Layout from '../components/layout'
import DateTime from '../components/dateTime'
import site from '../site.config.json'
import { getThumbPath } from '../lib/imgur'

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
              rel="noopener"
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
        <ul className="grid gap-y-6">
          {allPostsMetaData.map(({ id, date, title, desc, image }) => (
            <li key={id}>
              <Link href={`/posts/${id}`}>
                <a className="flex">
                  <div className="thumb flex-shrink-0 mt-4 mr-5">
                    {image && (
                      <miyaoka-img-loader
                        class="w-full h-full block border box-content border-gray-400 bg-gray-100 rounded-[42%] relative z-0"
                        src={getThumbPath(image)}
                      ></miyaoka-img-loader>
                    )}
                  </div>
                  <div>
                    <small className="text-gray-500">
                      <DateTime dateString={date} />
                    </small>
                    <h2 className="text-lg font-bold">{title}</h2>
                    {desc && (
                      <div className="text-gray-500 text-sm leading-snug">
                        {desc}
                      </div>
                    )}
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = await getSortedPostsData()

  // reduce state data
  const allPostsMetaData = allPostsData.map((post) => {
    const { contentHtml, ...metaData } = post
    return metaData
  })

  return {
    props: {
      allPostsMetaData,
    },
  }
}
