import Head from 'next/head'
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
    <div className="max-w-screen-sm my-10 mx-auto justify-center px-2">
      <Head>
        <meta name="description" key="description" content={siteDesc} />
        <meta name="twitter:card" key="twitter:card" content="summary" />
        <meta
          property="og:site_name"
          key="og:site_name"
          content="miyaoka.dev"
        />
        <meta
          property="og:image"
          key="og:image"
          content="https://i.imgur.com/iwfniKw.png"
        />
        <meta
          property="og:description"
          key="og:description"
          content={siteDesc}
        />
        <meta property="og:title" key="og:title" content={siteTitle} />
      </Head>
      <header className="flex">
        <Link href="/">
          <a className="text-lg font-bold">{siteTitle}</a>
        </Link>
        <div className="flex-grow flex justify-end">
          {linkList.map((link) => {
            return (
              <a
                key={link.url}
                href={link.url}
                title={link.title}
                target="_blank"
                rel="noopener"
              >
                <img className="h-8 w-8" src={link.img} alt={link.title} />
              </a>
            )
          })}
        </div>
      </header>
      <main className="mt-20">{children}</main>
    </div>
  )
}
