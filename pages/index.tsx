import Head from 'next/head'
import Layout from '../components/layout'

import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import DateTime from '../components/dateTime'
import { getThumbPath } from '../lib/imgur'
import site from '../site.config.json'

const linkList = [
  {
    title: 'twitter',
    img: '/images/twitter-outline.svg',
    url: 'https://twitter.com/miyaoka',
  },

  {
    title: 'GitHub',
    img: '/images/github-outline.svg',
    url: 'https://github.com/miyaoka/miyaoka.dev',
  },

  {
    title: 'RSS',
    img: '/images/github-outline.svg',
    url: `/${site.feedPath}`,
  },
]

export default function Home({
  allPostsData,
}: {
  allPostsData: {
    date: string
    title: string
    id: string
    desc?: string
    image?: string
  }[]
}) {
  return (
    <Layout home>
      <Head>
        <title>{site.title}</title>
      </Head>
      <div className="flex" title="profile">
        {linkList.map((link) => {
          return (
            <a
              key={link.url}
              href={link.url}
              title={link.title}
              target="_blank"
              rel="noopener"
            >
              <img className="h-10 w-10" src={link.img} alt={link.title} />
            </a>
          )
        })}
      </div>
      <section className="mt-20">
        <ul className="grid gap-y-4">
          {allPostsData.map(({ id, date, title, desc, image }) => (
            <li key={id} className="flex items-center">
              <div className="thumb flex-shrink-0 mr-4">
                {image && (
                  <Link href={`/posts/${id}`}>
                    <a title={title}>
                      <img
                        src={getThumbPath(image)}
                        className="rounded-full"
                        loading="lazy"
                        title={title}
                      />
                    </a>
                  </Link>
                )}
              </div>
              <div>
                <small className="text-gray-500">
                  <DateTime dateString={date} />
                </small>
                <h2 className="text-lg font-bold">
                  <Link href={`/posts/${id}`}>
                    <a>{title}</a>
                  </Link>
                </h2>
                {desc && (
                  <div className="text-gray-500 text-sm leading-snug">
                    {desc}
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
  return {
    props: {
      allPostsData,
    },
  }
}
