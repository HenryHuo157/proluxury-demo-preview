import { useState } from 'react'
import { useLang, dict } from '../i18n.jsx'

export default function NotFoundPage() {
  const { lang } = useLang()
  const t = dict[lang]
  return (
    <div className="page notfound">
      <div className="container notfound-inner">
        <span className="kicker">404</span>
        <h1>{t.notFoundTitle}</h1>
        <p>{t.notFoundBody}</p>
        <a className="btn" href="#/">
          {t.backHome}
        </a>
      </div>
    </div>
  )
}
