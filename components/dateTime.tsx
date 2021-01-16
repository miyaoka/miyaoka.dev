import { parseFromTimeZone, formatToTimeZone } from 'date-fns-timezone'
import { timeZone } from '../site.config.json'

export default function DateTime({ dateString }: { dateString: string }) {
  const utcDate = parseFromTimeZone(dateString, { timeZone })
  const datetime = utcDate.toISOString()
  const dateLabel = formatToTimeZone(utcDate, 'YYYY年M月D日', {
    timeZone,
  })

  return <time dateTime={datetime}>{dateLabel}</time>
}
