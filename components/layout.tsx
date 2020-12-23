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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="og:image" content="/images/ogp.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="description" content={siteDesc} />
        <meta name="og:description" content={siteDesc} />
        <meta name="og:title" content={siteTitle} />
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
