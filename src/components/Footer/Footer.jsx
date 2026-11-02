import { useLocation } from 'react-router-dom'
import SocialLinks from '../SocialLinks/SocialLinks'
import './Footer.css'

export default function Footer() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <img src="/images/logo.png" alt="UMass Product" className="footer__logo" />
          <div className="footer__socials">
            {isHome
              ? <p className="footer__meeting">Every other Wednesday, from 7–8 PM</p>
              : <SocialLinks />
            }
          </div>
          <p className="footer__established">Established 2019.</p>
          <a href="mailto:pmclub@cs.umass.edu" className="footer__email">pmclub@cs.umass.edu</a>
          <p className="footer__copy">Manning College of Information and Computer Sciences at the University of Massachusetts Amherst.</p>
        </div>
      </div>
    </footer>
  )
}
