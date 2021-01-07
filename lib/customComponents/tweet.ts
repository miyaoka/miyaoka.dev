import { loadScript } from './loadScript'

const twReg = new RegExp('https://twitter.com/[^/]+/status/(\\d+)')

export class EmbedTweet extends HTMLElement {
  async connectedCallback() {
    const src = this.getAttribute('src')
    if (!src) return
    const matched = src.match(twReg)
    if (!matched) return
    const [_, tweetId] = matched

    this.renderPlaceholder(src)

    const observer = new IntersectionObserver(
      (entryList) => {
        entryList.forEach((entry) => {
          if (!entry.isIntersecting) return
          observer.unobserve(this)
          this.embedTweet(tweetId)
        })
      },
      { rootMargin: '100%' }
    )
    observer.observe(this)
  }
  renderPlaceholder(src: string) {
    this.innerHTML = `<p><a href="${src}" target="_blank" rel="noopener">${src}</a></p>`
  }
  async embedTweet(tweetId: string) {
    const win = window as any

    if (!win.twttr?.ready) {
      await loadScript({
        src: 'https://platform.twitter.com/widgets.js',
        id: 'twitter-widgets',
      })
    }

    await win.twttr?.widgets?.createTweet(tweetId, this, {
      align: 'center',
    })

    this.children[0].remove()
    this.classList.add('embedTweetLoaded')
  }
}
