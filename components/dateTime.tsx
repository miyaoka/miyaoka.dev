import { parseFromTimeZone, formatToTimeZone } from 'date-fns-timezone'
const tz = 'Asia/Tokyo'
export default function DateTime({ dateString }: { dateString: string }) {
  const utcDate = parseFromTimeZone(dateString, { timeZone: tz })
  const datetime = utcDate.toISOString()
  const dateLabel = formatToTimeZone(utcDate, 'YYYY年M月D日', {
    timeZone: tz,
  })

  return <time dateTime={datetime}>{dateLabel}</time>
}
