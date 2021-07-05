import {
  GetStaticPaths,
  InferGetStaticPropsType,
  GetStaticPropsContext,
} from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getAllPostTags, getSortedPostsData } from '../../lib/posts'
import Layout from '../../components/layout'
import DateTime from '../../components/dateTime'
import site from '../../site.config.json'
import { getThumbPath } from '../../lib/imgur'

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

      <section className="mt-20">
        <ul className="grid gap-y-6">
          {allPostsMetaData.map(({ id, date, title, desc, image, tags }) => (
            <li key={id} className="flex">
              <div className="thumb flex flex-shrink-0 mt-4 mr-5">
                {image && (
                  <Link href={`/posts/${id}`}>
                    <a>
                      <miyaoka-img-loader
                        class="w-full h-full block border box-content border-gray-400 bg-gray-100 rounded-[42%] relative z-0"
                        src={getThumbPath(image)}
                      ></miyaoka-img-loader>
                    </a>
                  </Link>
                )}
              </div>
              <div className="flex  flex-1 flex-col gap-2">
                <Link href={`/posts/${id}`}>
                  <a className="flex flex-col flex-1">
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
                  <div className="text-sm flex gap-2 text-white">
                    {tags.map((tag) => (
                      <Link href={`/tags/${tag}`} key={tag}>
                        <a className="px-2 bg-gray-400 hover:bg-red-500">
                          {tag}
                        </a>
                      </Link>
                    ))}
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

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllPostTags()
  console.log(paths)
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const allPostsData = await getSortedPostsData()

  const tag = params?.tag as string
  console.log(tag)

  // reduce state data
  const allPostsMetaData = allPostsData.flatMap((post) => {
    if (!post.tags?.includes(tag)) return []
    const { contentHtml, ...metaData } = post
    return [metaData]
  })

  return {
    props: {
      allPostsMetaData,
    },
  }
}
