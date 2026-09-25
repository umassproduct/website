import { useEffect, useRef, useState } from 'react'
import RedBubble from '../../components/RedBubble/RedBubble'
import Slideshow from '../../components/Slideshow/Slideshow'
import NewsletterInput from '../../components/NewsletterInput/NewsletterInput'
import SocialLinks from '../../components/SocialLinks/SocialLinks'
import Calendar from '../../components/Calendar/Calendar'
import ScrollFadeIn from '../../components/ScrollFadeIn/ScrollFadeIn'
import { slideshow as slideshowImages } from '../../../content/slideshow.json'
import calendarData from '../../../content/calendar.json'
import './Home.css'

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
    <h1 className="home__heading" ref={ref} aria-label={text}>
      <span className="home__heading-text">{displayed}</span>
      <span
        className={`home__heading-cursor${showCursor ? ' home__heading-cursor--blink' : ''}`}
        aria-hidden="true"
      />
    </h1>
  )
}

function LogoSet() {
  return (
    <>
      <img src="/images/alumni_logos/amazon_logo.png" alt="Amazon" className="home__alumni-logo" />
      <img src="/images/alumni_logos/microsoft_logo.png" alt="Microsoft" className="home__alumni-logo home__alumni-logo--large" />
      <img src="/images/alumni_logos/andruil_logo.png" alt="Anduril" className="home__alumni-logo" />
      <img src="/images/alumni_logos/uber_logo.webp" alt="Uber" className="home__alumni-logo home__alumni-logo--large" />
      <img src="/images/alumni_logos/Oracle-Logo.png" alt="Oracle" className="home__alumni-logo home__alumni-logo--large" />
      <img src="/images/alumni_logos/Atlassian-Logo.png" alt="Atlassian" className="home__alumni-logo home__alumni-logo--large" />
      <img src="/images/alumni_logos/Liberty_Mutual-Logo.wine.png" alt="Liberty Mutual" className="home__alumni-logo home__alumni-logo--large" />
      <img src="/images/alumni_logos/anchr_logo.svg" alt="Anchr" className="home__alumni-logo" />
      <img src="/images/alumni_logos/fidelity-logo-PNG.png.webp" alt="Fidelity" className="home__alumni-logo" />
      <img src="/images/alumni_logos/optum_logo.png" alt="Optum" className="home__alumni-logo" />
    </>
  )
}

const ANIM_DURATION = 18 // seconds, must match CSS

function AlumniScroll() {
  const trackRef = useRef(null)
  const startTimeRef = useRef(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    startTimeRef.current = Date.now()
  }, [])

  function skip(dir) {
    const track = trackRef.current
    if (!track) return
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    let newElapsed = ((elapsed + dir * 2) % ANIM_DURATION + ANIM_DURATION) % ANIM_DURATION
    startTimeRef.current = Date.now() - newElapsed * 1000
    track.style.animationDelay = `-${newElapsed}s`
  }

  return (
    <div
      className="home__alumni-wrap"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        className={`home__alumni-btn home__alumni-btn--left${hovered ? ' home__alumni-btn--visible' : ''}`}
        onClick={() => skip(-1)}
        aria-label="Scroll left"
        tabIndex={hovered ? 0 : -1}
      >
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="home__alumni-track-wrap">
        <div className="home__alumni-track" ref={trackRef}>
          <div className="home__alumni-set"><LogoSet /></div>
          <div className="home__alumni-set" aria-hidden="true"><LogoSet /></div>
        </div>
      </div>
      <button
        className={`home__alumni-btn home__alumni-btn--right${hovered ? ' home__alumni-btn--visible' : ''}`}
        onClick={() => skip(1)}
        aria-label="Scroll right"
        tabIndex={hovered ? 0 : -1}
      >
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  )
}

export default function Home() {
  return (
    <div className="home">
      <div className="home__alert">
        <span className="home__alert-text">
          🚨 SECOND MEETING: PRODUCT 101: BUILD YOUR MVP — SEPTEMBER 30TH, 7-8 PM, ILC S311
        </span>
      </div>

      <div className="home__header">
        <TypewriterHeading text="Your role in tech starts here." />
        <p className="home__tagline">
          A student organization dreaming up the next generation of tech unicorns and studying products at UMass Amherst.
        </p>
      </div>

      <section className="home__hero" aria-label="Hero">
        <ScrollFadeIn>
          <RedBubble className="home__bubble">
            <Slideshow images={slideshowImages} />
            <NewsletterInput />
          </RedBubble>
        </ScrollFadeIn>
      </section>

      {/* Alumni scroll */}
      <section className="home__alumni" aria-label="Alumni companies">
        <ScrollFadeIn>
          <p className="home__alumni-label">Our alumni are at</p>
          <AlumniScroll />
        </ScrollFadeIn>
      </section>

      <section className="home__calendar" aria-label="Event Calendar">
        <ScrollFadeIn>
          <Calendar
            semester={calendarData.semester}
            year={calendarData.year}
            events={calendarData.events}
            meetingInfo={calendarData.meetingInfo}
          />
        </ScrollFadeIn>
      </section>

      <ScrollFadeIn className="home__social">
        <SocialLinks />
      </ScrollFadeIn>
    </div>
  )
}
