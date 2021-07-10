import Link from 'next/link'
import md5 from 'blueimp-md5'

const emojiMap: Record<string, string> = {
  sampo: '🦶',
  food: '🍙',
  game: '🎲',
  tech: '🧪',
  plants: '🌱',
  workstyle: '👔',
  lifestyle: '🧡',
  buying: '💸',
  book: '📚',
  music: '🎵',
  movie: '🎞️',
  column: '📰',
}

const getHue = (input: string): number => {
  const hash = md5(input)
  return parseInt(hash.substr(0, 2), 16)
}

export const TagLink = ({ tag }: { tag: string }) => {
  const emoji = emojiMap[tag]

  const text = emoji == null ? tag : `${emoji} ${tag}`
  return (
    <Link href={`/tags/${tag}`} key={tag}>
      <a
        className="px-1.5 bg-gray-300 hover:bg-red-500 rounded-lg"
        style={{
          background: `hsl(${getHue(tag)}, 40%, 60%)`,
        }}
      >
        {text}
      </a>
    </Link>
  )
}
