import { useEffect } from 'react'
import {
  GetStaticPaths,
  InferGetStaticPropsType,
  GetStaticPropsContext,
} from 'next'
import Head from 'next/head'
import { Twitter } from 'react-feather'

import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import DateTime from '../../components/dateTime'
import styles from './post.module.css'

export default function Post({
  postData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { id, title, date, contentHtml, desc, image } = postData

  useEffect(() => {
    // @ts-ignore
    if (typeof twttr !== 'undefined') {
      // @ts-ignore
      twttr.widgets.load()
    } else {
      const s = document.createElement('script')
      s.setAttribute('src', 'https://platform.twitter.com/widgets.js')
      s.setAttribute('async', 'true')
      s.setAttribute('charset', 'utf-8')
      document.head.appendChild(s)
    }
  }, [])

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta property="og:title" key="og:title" content={title} />
        {desc && (
          <>
            <meta name="description" key="description" content={desc} />
            <meta
              property="og:description"
              key="og:description"
              content={desc}
            />
          </>
        )}
        {image && (
          <>
            <meta
              name="twitter:card"
              key="twitter:card"
              content="summary_large_image"
            />
            <meta property="og:image" key="og:image" content={image} />
          </>
        )}
      </Head>
      <article className={`${styles.article} mt-16 lg:text-lg`}>
        <small className="text-gray-500">
          <DateTime dateString={date} />
        </small>
        <h1 className="text-3xl font-bold my-2">{title}</h1>
        <div
          className="my-8"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
      <div className="flex justify-center">
        <a
          href={`https://twitter.com/intent/tweet?text="${title}"%0ahttps://miyaoka.dev/posts/${id}`}
          target="_blank"
          rel="noopener"
          className="flex items-center flex-col"
          title="Share on Twitter"
        >
          <Twitter className="h-10 w-10" />
          share
        </a>
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const postData = await getPostData(params?.id as string)
  return {
    props: {
      postData,
    },
  }
}
