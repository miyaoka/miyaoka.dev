import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from '../lib/gtag'
import config from '../site.config.json'

const { host, feedPath } = config
const componentsVersion = `0.2.2`
const componentsPath = `https://unpkg.com/@miyaoka/miyaoka-components@${componentsVersion}/dist/miyaoka-components/miyaoka-components`

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja" className="font-body text-base text-gray-700 break-words">
        <Head>
          {GA_TRACKING_ID != null && (
            <>
              {/* Global Site Tag (gtag.js) - Google Analytics */}
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
              />
            </>
          )}
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
          <link
            rel="alternate"
            type="application/rss+xml"
            href={`${host}${feedPath}`}
          />
          <script type="module" async src={`${componentsPath}.esm.js`} />
          <script noModule async src={`${componentsPath}.js`} />
        </Head>
        <body className="pt-10 pb-40 px-4 tablet:p-0">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
