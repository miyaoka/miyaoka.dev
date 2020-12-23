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
        <meta name="description" key="description" content={siteDesc} />
        <meta name="twitter:card" key="twitter:card" content="summary" />
        <meta
          property="og:site_name"
          key="og:site_name"
          content="miyaoka.dev"
        />
        <meta property="og:image" key="og:image" content="/images/ogp.png" />
        <meta
          property="og:description"
          key="og:description"
          content={siteDesc}
        />
        <meta property="og:title" key="og:title" content={siteTitle} />
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
                <img src={link.img} alt={link.title} />
              </a>
            )
          })}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
