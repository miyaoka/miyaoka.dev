import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import { GetStaticProps, GetStaticPaths } from 'next'

export default function Post({
  postData,
}: {
  postData: {
    title: string
    date: string
    contentHtml: string
    desc?: string
    image?: string
  }
}) {
  const { title, date, contentHtml, desc, image } = postData
  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
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
      <article>
        <h1 className={utilStyles.headingXl}>{title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={date} />
        </div>
        <div
          className={utilStyles.text}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string)
  return {
    props: {
      postData,
    },
  }
}
