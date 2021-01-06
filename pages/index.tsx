import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Twitter, GitHub, Rss } from 'react-feather'
import { getSortedPostsData } from '../lib/posts'
import Layout from '../components/layout'
import DateTime from '../components/dateTime'
import ThumbImg from '../components/thumbImg'
import site from '../site.config.json'

const linkList = [
  {
    title: 'Twitter',
    url: 'https://twitter.com/miyaoka',
    comp: Twitter,
  },
  {
    title: 'GitHub',
    url: 'https://github.com/miyaoka/miyaoka.dev',
    comp: GitHub,
  },
  {
    title: 'RSS',
    url: site.feedPath,
    comp: Rss,
  },
]

export default function Home({
  allPostsMetaData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout home>
      <Head>
        <title>{site.title}</title>
      </Head>
      <div className="inline-grid grid-flow-col gap-x-2" title="profile">
        {linkList.map((link) => {
          const Icon = link.comp
          return (
            <a
              key={link.url}
              href={link.url}
              title={link.title}
              target="_blank"
              rel="noopener"
            >
              <Icon className="h-8 w-8 text-red-300" />
            </a>
          )
        })}
      </div>
      <section className="mt-20">
        <ul className="grid gap-y-4">
          {allPostsMetaData.map(({ id, date, title, desc, image }) => (
            <li key={id} className="flex">
              <div className="thumb flex-shrink-0 mt-4 mr-5">
                {image && (
                  <Link href={`/posts/${id}`}>
                    <a
                      title={title}
                      className="w-full h-full block border box-content border-gray-400 bg-gray-100 rounded-full"
                    >
                      {ThumbImg({ image, title })}
                    </a>
                  </Link>
                )}
              </div>
              <div>
                <small className="text-gray-500">
                  <DateTime dateString={date} />
                </small>
                <Link href={`/posts/${id}`}>
                  <a className="block">
                    <h2 className="text-lg font-bold">{title}</h2>
                    {desc && (
                      <div className="text-gray-500 text-sm leading-snug">
                        {desc}
                      </div>
                    )}
                  </a>
                </Link>
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
