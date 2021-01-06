// https://github.com/zenn-dev/zenn-editor/tree/master/packages/zenn-embed-elements

import { EmbedTweet } from './tweet'

const defineElement = (name: string, constructor: CustomElementConstructor) => {
  if (customElements.get(name)) return
  customElements.define(name, constructor)
}

defineElement('embed-tweet', EmbedTweet)
