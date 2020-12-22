import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

export const siteTitle = 'miyaoka.dev'
const siteDesc = 'miyaokaの備忘録'

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
]

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode
  home?: boolean
}) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={siteDesc} />
        <meta name="og:description" content={siteDesc} />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary" />
      </Head>
      <header className={styles.header}>
        <h1 className={utilStyles.headingLg}>
          <Link href="/">
            <a className={utilStyles.colorInherit}>{siteTitle}</a>
          </Link>
        </h1>
        <div className={styles.headLinks}>
          {linkList.map((link) => {
            return (
              <a
                href={link.url}
                title={link.title}
                target="_blank"
                rel="noopener"
              >
                <img src={link.img} width="32" height="32" />
              </a>
            )
          })}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
