import { useLang, dict } from '../i18n.jsx'
import { categories, catName } from '../lib/data.js'
import logoImg from '../Logo/Logo2.png'
import {
  IconPhone, IconMail, IconPin, IconFacebook, IconInstagram, IconYoutube, IconWhatsapp,
} from './Icons.jsx'

const SERVICE_HREFS = ['/contact', '/info/delivery', '/info/returns', '/info/warranty', '/info/faq', '/info/privacy']

export default function Footer() {
  const { lang } = useLang()
  const t = dict[lang]
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col about">
          <span className="footer-logo">
            <img src={logoImg} alt="Proluxury 普樂氏" />
          </span>
          <p>{t.footerAbout}</p>
          <div className="footer-social">
            <a href="#/" aria-label="Facebook"><IconFacebook /></a>
            <a href="#/" aria-label="Instagram"><IconInstagram /></a>
            <a href="#/" aria-label="YouTube"><IconYoutube /></a>
            <a href="#/" aria-label="WhatsApp"><IconWhatsapp /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>{t.footerProductsTitle}</h4>
          <ul>
            {categories.map((g) => (
              <li key={g.code}>
                <a href={`#/category/${g.code}`}>{catName(g, lang)}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t.footerServiceTitle}</h4>
          <ul>
            {t.footerServiceLinks.map((s, i) => (
              <li key={s}>
                <a href={`#${SERVICE_HREFS[i] || '/contact'}`}>{s}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t.footerContactTitle}</h4>
          <ul className="contact-list">
            <li><IconPin size={16} /> {t.footerAddress}</li>
            <li><IconPhone size={16} /> {t.footerHotline}</li>
            <li><IconMail size={16} /> {t.footerEmail}</li>
            <li className="muted">{t.footerHours}</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>{t.footerCopyright}</span>
          <span className="muted">{t.footerDisclaimer}</span>
        </div>
      </div>
    </footer>
  )
}
