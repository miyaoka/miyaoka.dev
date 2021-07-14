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
  nextjs: '🔺',
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
  const hue = getHue(tag)
  return (
    <Link href={`/tags/${tag}`} key={tag}>
      <a
        className="px-1.5 rounded-lg border"
        style={{
          borderColor: `hsl(${hue}, 50%, 50%)`,
          background: `hsl(${hue}, 50%, 90%)`,
        }}
        title={`${tag}` + (count != null ? ` (${count})` : '')}
        data-prefetch
      >
        {getTagLabel(tag)}
      </a>
    </Link>
  )
}
