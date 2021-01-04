import { format } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
export default function DateTime({ dateString }: { dateString: string }) {
  const date = zonedTimeToUtc(dateString, 'Asia/Tokyo')
  const datetime = date.toISOString()
  const dateLabel = format(date, 'yyyy年M月d日')

  return <time dateTime={datetime}>{dateLabel}</time>
}
