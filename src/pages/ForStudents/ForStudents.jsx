import { useEffect, useRef, useState } from 'react'
import RedBubble from '../../components/RedBubble/RedBubble'
import NewsletterInput from '../../components/NewsletterInput/NewsletterInput'
import SocialLinks from '../../components/SocialLinks/SocialLinks'
import Calendar from '../../components/Calendar/Calendar'
import ScrollFadeIn from '../../components/ScrollFadeIn/ScrollFadeIn'
import calendarData from '../../../content/calendar.json'
import './ForStudents.css'

function TypewriterHeading({ text }) {
  const [charCount, setCharCount] = useState(() => {
    if (typeof window === 'undefined') return 0
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? text.length : 0
  })
  const [started, setStarted] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || started || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.unobserve(el)
  }, [started])

  useEffect(() => {
    if (!started) return
    if (charCount >= text.length) return

    const timeout = setTimeout(() => {
      setCharCount(prev => prev + 1)
    }, 60)

    return () => clearTimeout(timeout)
  }, [started, charCount, text.length])

  const displayed = text.slice(0, charCount)
  const showCursor = started && charCount < text.length

  return (
    <h1 className="for-students__heading" ref={ref} aria-label={text}>
      <span className="for-students__heading-text">{displayed}</span>
      <span
        className={`for-students__heading-cursor${showCursor ? ' for-students__heading-cursor--blink' : ''}`}
        aria-hidden="true"
      />
    </h1>
  )
}

export default function ForStudents() {
  return (
    <div className="for-students page">
      <div className="for-students__header">
        <TypewriterHeading text="Join us in 4 steps." />
      </div>

      {/* Step 1: Join newsletter */}
      <section className="for-students__step">
        <ScrollFadeIn>
          <div className="for-students__step-header">
            <span className="for-students__step-number">1</span>
            <h3 className="for-students__step-title">
              Join our newsletter:
            </h3>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <div className="for-students__newsletter-container">
            <RedBubble>
              <NewsletterInput />
            </RedBubble>
          </div>
        </ScrollFadeIn>
      </section>

      {/* Step 2: Connect on social media */}
      <section className="for-students__step">
        <ScrollFadeIn>
          <div className="for-students__step-header">
            <span className="for-students__step-number">2</span>
            <h3 className="for-students__step-title">
              Follow our socials.
            </h3>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <div className="for-students__socials-container">
            <SocialLinks />
          </div>
        </ScrollFadeIn>
      </section>

      {/* Step 3: Add calendar */}
      <section className="for-students__step">
        <ScrollFadeIn>
          <div className="for-students__step-header">
            <span className="for-students__step-number">3</span>
            <h3 className="for-students__step-title">
              Add our calendar to yours:
            </h3>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <div className="for-students__calendar-container">
            <Calendar
              semester={calendarData.semester}
              year={calendarData.year}
              events={calendarData.events}
              meetingInfo={calendarData.meetingInfo}
            />
          </div>
        </ScrollFadeIn>
      </section>

      {/* Step 4: Attend a meeting */}
      <section className="for-students__step">
        <ScrollFadeIn>
          <div className="for-students__step-header">
            <span className="for-students__step-number">4</span>
            <h3 className="for-students__step-title">
              Attend a meeting. Here's our next one:
            </h3>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <div className="for-students__poster-container">
            <RedBubble className="for-students__poster-bubble">
              <div className="for-students__poster for-students__poster--placeholder">
                <p>Product 101: Build Your MVP</p>
                <p>September 30th, 7-8 PM — ILC S311.</p>
              </div>
            </RedBubble>
          </div>
        </ScrollFadeIn>
      </section>
    </div>
  )
}
