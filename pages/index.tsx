import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'

import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'

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
        <title>{siteTitle}</title>
      </Head>
      <section>
        <ul className="grid gap-y-4">
          {allPostsData.map(({ id, date, title, desc }) => (
            <li key={id} className="">
              <small className="text-gray-500">
                <Date dateString={date} />
              </small>
              <h2 className="text-lg font-bold">
                <Link href={`/posts/${id}`}>
                  <a>{title}</a>
                </Link>
              </h2>
              {desc && <small className="text-gray-500">{desc}</small>}
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
