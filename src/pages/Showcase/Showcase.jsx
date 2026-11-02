import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import SectionHeadline from '../../components/SectionHeadline/SectionHeadline'
import RedBubble from '../../components/RedBubble/RedBubble'
import ScrollFadeIn from '../../components/ScrollFadeIn/ScrollFadeIn'
import { showcase_semesters as semesters } from '../../../content/semesters.json'
import './Showcase.css'

function PitchRow({ meeting, mi, selectedId, openPitch }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [hovered, setHovered] = useState(false)

  function updateScrollState() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState)
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  function scroll(dir) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth / 3 + 16), behavior: 'smooth' })
  }

  return (
    <div
      className="showcase__meeting"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="showcase__meeting-header">
        <span className="showcase__meeting-date">{meeting.date}</span>
        <span className="showcase__meeting-sep">·</span>
        <span className="showcase__meeting-title">{meeting.title}</span>
      </div>
      <div className="showcase__pitches-wrap">
        <button
          className={`showcase__scroll-btn showcase__scroll-btn--left${hovered && canScrollLeft ? ' showcase__scroll-btn--visible' : ''}`}
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          tabIndex={hovered && canScrollLeft ? 0 : -1}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="showcase__pitches-scroll" ref={scrollRef}>
          {meeting.pitches.map((pitch, pi) => (
            <button
              key={pi}
              className={`showcase__pitch-card${!(pitch.youtubeId || pitch.driveId) ? ' showcase__pitch-card--no-video' : ''}`}
              onClick={() => (pitch.youtubeId || pitch.driveId) && openPitch(pitch, selectedId, mi, pi)}
              aria-label={`View pitch: ${pitch.title}`}
            >
              <div className="showcase__pitch-video-wrap">
                {(pitch.thumbnail || pitch.youtubeId) ? (
                  <img
                    src={pitch.thumbnail || `https://img.youtube.com/vi/${pitch.youtubeId}/maxresdefault.jpg`}
                    loading="lazy"
                    alt={pitch.title}
                    className="showcase__pitch-video"
                  />
                ) : (
                  <div className="showcase__pitch-video showcase__pitch-video--placeholder">
                    <span>{pitch.driveId ? 'Watch recording' : 'Recording coming soon'}</span>
                  </div>
                )}
              </div>
              <div className="showcase__pitch-meta">
                <p className="showcase__pitch-title">{pitch.title}</p>
                {pitch.presenters?.length > 0 && (
                  <p className="showcase__pitch-presenters">
                    {pitch.presenters.map((p, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        {p.linkedin ? (
                          <a
                            href={p.linkedin}
                            className="showcase__pitch-presenter-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                          >
                            {p.name}
                          </a>
                        ) : (
                          <span className="showcase__pitch-presenter">{p.name}</span>
                        )}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
        <button
          className={`showcase__scroll-btn showcase__scroll-btn--right${hovered && canScrollRight ? ' showcase__scroll-btn--visible' : ''}`}
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          tabIndex={hovered && canScrollRight ? 0 : -1}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}

export default function Showcase() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [copied, setCopied] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const selectedId = searchParams.get('sem') || semesters[0]?.id

  const activePitch = (() => {
    const sem = searchParams.get('sem')
    const mi = parseInt(searchParams.get('mi'), 10)
    const pi = parseInt(searchParams.get('pi'), 10)
    if (!sem || Number.isNaN(mi) || Number.isNaN(pi)) return null

    const found = semesters.find(s => s.id === sem)
    const pitch = found?.meetings[mi]?.pitches[pi]
    if (!pitch) return null

    return { ...pitch, _sem: sem, _mi: mi, _pi: pi }
  })()

  function openPitch(pitch, semId, mi, pi) {
    setSearchParams({ sem: semId, mi, pi })
  }

  function closePitch() {
    setSearchParams({})
    setCopied(false)
  }

  function copyLink() {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    navigator.clipboard?.writeText(window.location.href).catch(() => {})
  }

  const semester = semesters.find(s => s.id === selectedId)

  return (
    <div className="showcase page">
      <ScrollFadeIn>
        <SectionHeadline text="Product Showcase" as="h1" glow center />
      </ScrollFadeIn>

      {/* Featured video — unchanged */}
      <section className="showcase__featured">
        <ScrollFadeIn>
          <RedBubble className="showcase__featured-bubble">
            <video
              className="showcase__featured-video"
              src="/images/showcase/arham_main.mp4"
              controls
              playsInline
              aria-label="Featured pitch: Arham presenting Apple Mail app redesign"
            />
            <div className="showcase__featured-content">
              <p className="showcase__featured-description">
                Arham presents a feature redesign for Apple Mail that transforms emails into interactive 3D cards with haptic touch and swipe gestures for a frictionless UX.
              </p>
            </div>
          </RedBubble>
        </ScrollFadeIn>
      </section>

      {/* Semester browser */}
      <section className="showcase__semesters">
        <div className="showcase__semester-bar">
          <div className="showcase__dropdown" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDropdownOpen(false) }}>
            <button
              className={`showcase__dropdown-trigger${dropdownOpen ? ' showcase__dropdown-trigger--open' : ''}`}
              onClick={() => setDropdownOpen(o => !o)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <span>{semesters.find(s => s.id === selectedId)?.label}</span>
              <svg className="showcase__dropdown-chevron" width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {dropdownOpen && (
              <ul className="showcase__dropdown-menu" role="listbox">
                {semesters.map(s => (
                  <li
                    key={s.id}
                    role="option"
                    aria-selected={s.id === selectedId}
                    className={`showcase__dropdown-option${s.id === selectedId ? ' showcase__dropdown-option--active' : ''}`}
                    onMouseDown={() => {
                      setSearchParams({ sem: s.id })
                      setDropdownOpen(false)
                    }}
                  >
                    {s.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {semester?.meetings.map((meeting, mi) => (
          <PitchRow key={mi} meeting={meeting} mi={mi} selectedId={selectedId} openPitch={openPitch} />
        ))}
      </section>

      {/* Pitch modal */}
      {activePitch && (
        <div
          className="showcase__modal-overlay"
          onClick={closePitch}
        >
          <div
            className="showcase__modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="showcase__modal-close"
              onClick={closePitch}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="showcase__modal-video-wrap">
              <iframe
                className="showcase__modal-video"
                src={activePitch.driveId
                  ? `https://drive.google.com/file/d/${activePitch.driveId}/preview`
                  : `https://www.youtube.com/embed/${activePitch.youtubeId}?autoplay=1&rel=0`}
                referrerPolicy="strict-origin-when-cross-origin"
                title={activePitch.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="showcase__modal-footer">
              <div className="showcase__modal-title-wrap">
                <p className="showcase__modal-title">{activePitch.title}</p>
                {activePitch.presenters?.length > 0 && (
                  <p className="showcase__modal-presenters">
                    {activePitch.presenters.map((p, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        {p.linkedin ? (
                          <a
                            href={p.linkedin}
                            className="showcase__modal-presenter-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {p.name}
                          </a>
                        ) : (
                          <span className="showcase__modal-presenter">{p.name}</span>
                        )}
                      </span>
                    ))}
                  </p>
                )}
              </div>
              {activePitch.driveId && (
                <a
                  className="showcase__modal-link-btn"
                  href={`https://drive.google.com/file/d/${activePitch.driveId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Drive
                </a>
              )}
              <button className="showcase__modal-link-btn" onClick={copyLink}>
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
