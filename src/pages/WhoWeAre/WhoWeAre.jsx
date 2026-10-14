import { useState } from 'react'
import SectionHeadline from '../../components/SectionHeadline/SectionHeadline'
import RedBubble from '../../components/RedBubble/RedBubble'
import ScrollFadeIn from '../../components/ScrollFadeIn/ScrollFadeIn'
import { eboard as eboardData } from '../../../content/eboard.json'
import './WhoWeAre.css'

const semesters = eboardData.map(e => e.semester)
const eboards = Object.fromEntries(eboardData.map(e => [e.semester, e.members]))

export default function WhoWeAre() {
  const [selected, setSelected] = useState(semesters[0])
  const [displayed, setDisplayed] = useState(semesters[0])
  const [fading, setFading] = useState(false)
  const [open, setOpen] = useState(false)

  function handleSelect(s) {
    if (s === selected) { setOpen(false); return }
    setOpen(false)
    setFading(true)
    setTimeout(() => {
      setDisplayed(s)
      setSelected(s)
      setFading(false)
    }, 200)
  }

  return (
    <div className="who-we-are page">
      <ScrollFadeIn>
        <SectionHeadline text="Who We Are" as="h1" glow center />
      </ScrollFadeIn>

      <div className="who-we-are__layout">
        <div className="who-we-are__content">
          <ScrollFadeIn>
            <p className="who-we-are__meetings">
              <span className="who-we-are__meetings-label">Meetings:</span>{' '}
              <span className="who-we-are__meetings-time">Every other Wednesday 7-8 PM · ILC S311</span>
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn>
            <p className="who-we-are__intro">
              Hi there 👋 we are a student organization in the Manning College of Information and Computer Sciences exploring early careers in product management.
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn>
            <blockquote className="who-we-are__quote">
              "Think like a Tech CEO. Think like a MAANG engineer."
            </blockquote>
          </ScrollFadeIn>

          <ScrollFadeIn>
            <p className="who-we-are__tagline">
              Aspiring to these goals? UMass Product is where you belong.
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn>
            <p className="who-we-are__activities">
              We meet weekly on Wednesday evenings to discuss{' '}
              <span className="who-we-are__highlight who-we-are__highlight--red">trends in technology</span>,{' '}
              <span className="who-we-are__highlight who-we-are__highlight--pink">conduct product thinking seminars</span>,{' '}
              <span className="who-we-are__highlight who-we-are__highlight--gray">work on case studies</span>, and occasionally{' '}
              <span className="who-we-are__highlight who-we-are__highlight--maroon">prep together for tech recruitment</span>.
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn>
            <p className="who-we-are__welcome">
              All UMass Amherst undergrad/graduate students and faculty interested in learning more about product management concepts are welcome!
            </p>
          </ScrollFadeIn>
        </div>

        <ScrollFadeIn>
          <RedBubble className="who-we-are__video-bubble">
            <video
              className="who-we-are__video"
              src="/images/pictures_of_us/welcome_vid_portrait.mp4"
              autoPlay
              loop
              playsInline
              controls
              aria-label="Welcome to UMass Product"
            />
          </RedBubble>
        </ScrollFadeIn>
      </div>

      <section className="who-we-are__eboard">
        <ScrollFadeIn className="who-we-are__eboard-header">
          <div className="who-we-are__eboard-semester-wrap">
            <button
              className="who-we-are__eboard-semester"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
            >
              {selected}
              <span className={`who-we-are__eboard-chevron${open ? ' who-we-are__eboard-chevron--open' : ''}`}>›</span>
            </button>
            {open && (
              <div className="who-we-are__eboard-dropdown">
                {semesters.map(s => (
                  <button
                    key={s}
                    className={`who-we-are__eboard-dropdown-item${s === selected ? ' who-we-are__eboard-dropdown-item--active' : ''}`}
                    onClick={() => handleSelect(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <h2 className="who-we-are__eboard-heading">Executive Board</h2>
        </ScrollFadeIn>
        <div className={`who-we-are__eboard-grid${fading ? ' who-we-are__eboard-grid--fading' : ''}`}>
          {eboards[displayed].map((member, i) => {
            const inner = (
              <>
                <p className="who-we-are__eboard-name">{member.name}</p>
                <p className="who-we-are__eboard-role">{member.role}</p>
              </>
            )
            return (
              <ScrollFadeIn key={i}>
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    className="who-we-are__eboard-card"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="who-we-are__eboard-card who-we-are__eboard-card--no-link">
                    {inner}
                  </div>
                )}
              </ScrollFadeIn>
            )
          })}
        </div>
      </section>

      <section className="who-we-are__alumni">
        <ScrollFadeIn>
          <p className="who-we-are__alumni-label">Alumni in the industry</p>
          <div className="who-we-are__alumni-grid">
            {[
              { src: '/images/alumni_logos/amazon_logo.png',               alt: 'Amazon' },
              { src: '/images/alumni_logos/microsoft_logo.png',            alt: 'Microsoft' },
              { src: '/images/alumni_logos/uber_logo.webp',                alt: 'Uber' },
              { src: '/images/alumni_logos/salesforce_logo.svg.png',       alt: 'Salesforce' },
              { src: '/images/alumni_logos/Oracle-Logo.png',               alt: 'Oracle' },
              { src: '/images/alumni_logos/optum_logo.png',                alt: 'Optum' },
              { src: '/images/alumni_logos/fidelity-logo-PNG.png.webp',    alt: 'Fidelity' },
              { src: '/images/alumni_logos/Verizon-Logo-2000.png',         alt: 'Verizon' },
              { src: '/images/alumni_logos/Atlassian-Logo.png',            alt: 'Atlassian' },
              { src: '/images/alumni_logos/Liberty_Mutual-Logo.wine.png',  alt: 'Liberty Mutual' },
              { src: '/images/alumni_logos/andruil_logo.png',              alt: 'Anduril' },
              { src: '/images/alumni_logos/anchr_logo.svg',                alt: 'Anchr' },
              { src: '/images/alumni_logos/capital_one_logo.svg.png',     alt: 'Capital One' },
              { src: '/images/alumni_logos/Roku_logo.png',                alt: 'Roku' },
            ].map(({ src, alt }) => (
              <div key={alt} className="who-we-are__alumni-logo-wrap">
                <img src={src} alt={alt} className="who-we-are__alumni-logo" />
              </div>
            ))}
          </div>
        </ScrollFadeIn>
      </section>

    </div>
  )
}
