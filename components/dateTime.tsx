export default function DateTime({ dateString }: { dateString: string }) {
  const date = new Date(dateString)
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
