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
