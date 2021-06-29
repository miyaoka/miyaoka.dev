import { useEffect, useState } from 'react'
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
import site from '../../site.config.json'

export const config = {
  unstable_runtimeJS: false,
}

export default function Post({
  postData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [post, setPost] = useState(postData)

  // dev時ならmount時に記事内容の再取得を行う
  if (process.env.NODE_ENV !== 'production') {
    useEffect(() => {
      const fn = async () => {
        const res = await fetch(`/api/posts/${post.id}`).then((res) =>
          res.json()
        )
        setPost(res.postData)
      }
      fn()
    }, [])
  }

  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
        <link
          rel="canonical"
          href={`${site.host}${site.postsDir}/${post.id}`}
        ></link>
        <meta property="og:title" key="og:title" content={post.title} />
        {post.desc && (
          <>
            <meta name="description" key="description" content={post.desc} />
            <meta
              property="og:description"
              key="og:description"
              content={post.desc}
            />
          </>
        )}
        {post.image && (
          <>
            <meta
              name="twitter:card"
              key="twitter:card"
              content="summary_large_image"
            />
            <meta property="og:image" key="og:image" content={post.image} />
          </>
        )}
      </Head>
      <article className={`${styles.article} mt-16`}>
        <header className="text-center">
          <small className="text-gray-500">
            <DateTime dateString={post.date} />
          </small>
          <h1 className="text-4xl font-bold my-2">{post.title}</h1>
        </header>
        <div
          className="mt-20"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
      <footer className="mt-20">
        <div className="flex justify-center">
          <a
            href={`https://twitter.com/intent/tweet?text="${post.title}"%0ahttps://miyaoka.dev/posts/${post.id}`}
            target="_blank"
            rel="noopener"
            className="flex items-center flex-col"
            title="Share on Twitter"
          >
            <Twitter className="h-10 w-10" />
            share
          </a>
        </div>
      </footer>
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
