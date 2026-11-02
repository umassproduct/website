import { generateICSFile, downloadICSFile } from '../../utils/calendar'
import './Calendar.css'

export default function Calendar({ semester, year, events, meetingInfo, notice }) {
  const handleAddToCalendar = () => {
    const icsContent = generateICSFile(events, year, meetingInfo)
    downloadICSFile(icsContent)
  }

  return (
    <div className="calendar">
      <div className="calendar__header">
        <h2 className="calendar__title">{semester} {year}</h2>
        {meetingInfo && (
          <p className="calendar__subtitle">{meetingInfo}</p>
        )}
        {notice && <p className="calendar__notice">{notice}</p>}
      </div>

      <div className="calendar__container">
        <div className="calendar__events">
          {events.map((event, i) => (
            <div key={i} className="calendar__event">
              <div className="calendar__event-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M13 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="calendar__event-content">
                <h3 className="calendar__event-title">{event.title}</h3>
                <p className="calendar__event-date">
                  {event.date}
                  {event.note && <span className="calendar__event-note"> {event.note}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="calendar__add-button"
          onClick={handleAddToCalendar}
          aria-label="Add all events to your calendar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Add to Calendar
        </button>
      </div>
    </div>
  )
}
