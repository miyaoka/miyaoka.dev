import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'

import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'
import { getImgurSrc, getImgurThumb } from '../lib/imgur'

const getThumbPath = (imgPath: string) => {
  const imgurSrc = getImgurSrc(imgPath)
  if (imgurSrc == null) return imgPath

  const { id, ext } = imgurSrc
  // md→html化でlをつけてしまうので取り除く
  const removedSuffixId = id.replace(/l$/, '')
  return getImgurThumb(removedSuffixId, 'b', ext)
}

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
          {allPostsData.map(({ id, date, title, desc, image }) => (
            <li key={id} className="flex">
              <div className="thumb flex-shrink-0 mr-4">
                {image && (
                  <Link href={`/posts/${id}`}>
                    <a>
                      <img
                        src={getThumbPath(image)}
                        className="rounded-full"
                        loading="lazy"
                      />
                    </a>
                  </Link>
                )}
              </div>
              <div>
                <small className="text-gray-500">
                  <Date dateString={date} />
                </small>
                <h2 className="text-lg font-bold">
                  <Link href={`/posts/${id}`}>
                    <a>{title}</a>
                  </Link>
                </h2>
                {desc && <small className="text-gray-500">{desc}</small>}
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
