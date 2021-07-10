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

export const getTagLabel = (tag: string) => {
  const emoji = emojiMap[tag]

  return emoji == null ? tag : `${emoji} ${tag}`
}

export const TagLink = ({ tag, count }: { tag: string; count?: number }) => {
  return (
    <Link href={`/tags/${tag}`} key={tag}>
      <a
        className="px-1.5 bg-gray-300 hover:bg-red-500 rounded-lg"
        style={{
          background: `hsl(${getHue(tag)}, 40%, 60%)`,
        }}
        title={`${tag}` + (count != null ? ` (${count})` : '')}
      >
        {getTagLabel(tag)}
      </a>
    </Link>
  )
}
