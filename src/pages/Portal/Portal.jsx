import { useState, useEffect } from 'react'
import './Portal.css'

const PASSWORD = 'Praxis'
const WELCOME_TEXT = 'Welcome, member.'

export default function Portal() {
  const [input, setInput] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)
  const [typed, setTyped] = useState('')
  const [typing, setTyping] = useState(false)
  useEffect(() => {
    if (!unlocked) return
    setTyped('')
    setTyping(true)
    let i = 0
    const interval = setInterval(() => {
      i++
      setTyped(WELCOME_TEXT.slice(0, i))
      if (i >= WELCOME_TEXT.length) {
        clearInterval(interval)
        setTyping(false)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [unlocked])

  function handleSubmit(e) {
    e.preventDefault()
    if (input === PASSWORD) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (unlocked) {
    return (
      <div className="portal page portal--unlocked">
        <p className="portal__welcome">
          {typed}
          {typing && <span className="portal__cursor" />}
        </p>
        <div className="portal__teaser">
          <span className="portal__teaser-dot" />
          <p className="portal__teaser-text">Alumni contact info · recruiter connections · exclusive roles — coming soon.</p>
        </div>
        <div className="portal__resources">
          <a className="portal__resource-card" href="https://discord.gg/xFshvBAuzw" target="_blank" rel="noopener noreferrer">
            <span className="portal__resource-icon">💬</span>
            <p className="portal__resource-title">Discord</p>
            <p className="portal__resource-desc">Join the community</p>
          </a>
          <div className="portal__resource-card portal__resource-card--placeholder">
            <span className="portal__resource-icon">📁</span>
            <p className="portal__resource-title">Drive</p>
            <p className="portal__resource-desc">Meeting resources</p>
          </div>
          <div className="portal__resource-card portal__resource-card--placeholder">
            <span className="portal__resource-icon">📋</span>
            <p className="portal__resource-title">Notion</p>
            <p className="portal__resource-desc">Notes & docs</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="portal page">
      <div className="portal__gate">
        <div className="portal__lock">
          <svg className="portal__lock-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        <p className="portal__subtitle">Member access only.</p>
        <form className="portal__form" onSubmit={handleSubmit}>
          <input
            className={`portal__input${error ? ' portal__input--error' : ''}`}
            type="password"
            placeholder="Enter password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false) }}
            autoComplete="off"
            autoFocus
          />
          {error && <p className="portal__error">Incorrect password.</p>}
          <button className="portal__submit" type="submit">Enter</button>
        </form>
      </div>
    </div>
  )
}
