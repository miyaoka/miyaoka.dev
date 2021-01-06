import visit from 'unist-util-visit-parents'
import { Node } from 'unist'

const twReg = new RegExp('https://twitter.com/[^/]+/status/(\\d+)')

export const tweet = () => {
  return transform
}

function transform(tree: Node) {
  visit(tree, 'text', ontext)
}

function ontext<V extends Node>(node: V, parents: Node[]) {
  const value = String(node.value).trim()

  const lines = value.split('\n')

  if (lines.length !== 1) return

  const line = lines[0]

  const matched = line.match(twReg)
  if (!matched) return

  let length = parents.length
  const siblings = parents[length - 1].children as Node[]

  const link = {
    type: 'html',
    position: node.position,
    value: `<embed-tweet src="${line}" class="embedTweet" />`,
  }

  siblings[siblings.indexOf(node)] = link
}
