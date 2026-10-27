/**
 * Parses a date string like "February 18" and returns YYYYMMDD format
 */
function parseEventDate(dateStr, year) {
  const months = {
    'January': '01', 'February': '02', 'March': '03', 'April': '04',
    'May': '05', 'June': '06', 'July': '07', 'August': '08',
    'September': '09', 'October': '10', 'November': '11', 'December': '12'
  }

  // Extract month and day from strings like "February 18" or "May 6th"
  const parts = dateStr.match(/([A-Za-z]+)\s+(\d+)/)
  if (!parts) return null

  const month = months[parts[1]]
  const day = parts[2].padStart(2, '0')

  return `${year}${month}${day}`
}

const MEETING_END_HOUR = 20 // meetings run 7-8 PM Eastern
const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

function ordinal(n) {
  const rem = n % 100
  if (rem >= 11 && rem <= 13) return `${n}TH`
  return n + ({ 1: 'ST', 2: 'ND', 3: 'RD' }[n % 10] || 'TH')
}

/**
 * Returns the current date and hour in Amherst (America/New_York)
 */
function easternNow(now) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', hourCycle: 'h23',
    }).formatToParts(now).map(p => [p.type, p.value])
  )
  return {
    day: Date.UTC(parts.year, parts.month - 1, parts.day) / 86400000,
    hour: Number(parts.hour),
  }
}

/**
 * Finds the next meeting that hasn't ended yet and labels it relative to today
 * ("TONIGHT", "TOMORROW", "THIS WEDNESDAY", or "NEXT MEETING").
 * Returns null when no meetings remain this semester.
 */
export function getNextMeeting(events, year, now = new Date()) {
  const today = easternNow(now)

  for (const event of events) {
    const dateStr = parseEventDate(event.date, year)
    if (!dateStr) continue

    const month = Number(dateStr.slice(4, 6))
    const dayOfMonth = Number(dateStr.slice(6, 8))
    const eventDay = Date.UTC(year, month - 1, dayOfMonth) / 86400000
    const daysAway = eventDay - today.day

    if (daysAway < 0 || (daysAway === 0 && today.hour >= MEETING_END_HOUR)) continue

    let label = 'NEXT MEETING'
    if (daysAway === 0) label = 'TONIGHT'
    else if (daysAway === 1) label = 'TOMORROW'
    else if (daysAway < 7) label = `THIS ${WEEKDAYS[new Date(eventDay * 86400000).getUTCDay()]}`

    return {
      label,
      title: event.title.toUpperCase(),
      date: `${event.date.match(/[A-Za-z]+/)[0].toUpperCase()} ${ordinal(dayOfMonth)}`,
      location: (event.note || 'ILC S311').toUpperCase(),
    }
  }

  return null
}

/**
 * Generates an .ics file content from calendar events
 */
export function generateICSFile(events, year, meetingTime = '7-8 pm') {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  // Parse meeting time (default: 7-8 pm = 19:00-20:00)
  const startTime = '190000'
  const endTime = '200000'

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UMass Product//Events Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:UMass Product Fall 2026',
    'X-WR-TIMEZONE:America/New_York',
  ]

  events.forEach((event, index) => {
    const dateStr = parseEventDate(event.date, year)
    if (!dateStr) return

    const description = event.note ? `${event.note}\\n\\nWeekly meetings: ${meetingTime}` : `Weekly meetings: ${meetingTime}`

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${dateStr}-${index}@umassproduct.github.io`,
      `DTSTAMP:${timestamp}`,
      `DTSTART:${dateStr}T${startTime}`,
      `DTEND:${dateStr}T${endTime}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${description}`,
      'LOCATION:ILC S311',
      'STATUS:CONFIRMED',
      'END:VEVENT'
    )
  })

  icsContent.push('END:VCALENDAR')

  return icsContent.join('\r\n')
}

/**
 * Triggers download of .ics file
 */
export function downloadICSFile(icsContent, filename = 'umass-product-fall-2026.ics') {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
