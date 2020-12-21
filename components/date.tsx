import { parseISO, format } from 'date-fns'

export default function Date({ dateString }: { dateString: string }) {
  const date = parseISO(dateString)
  return (
    <time dateTime={dateString}>
      {date.toLocaleDateString('ja', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit',
        timeZone: 'Asia/Tokyo',
      })}
    </time>
  )
}
