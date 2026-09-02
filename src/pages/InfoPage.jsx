import { useEffect } from 'react'
import { useLang, dict } from '../i18n.jsx'
import { href } from '../router.jsx'
import NotFoundPage from './NotFoundPage.jsx'

export default function InfoPage({ slug }) {
  const { lang } = useLang()
  const t = dict[lang]
  const page = t.infoPages[slug]

  useEffect(() => {
    if (page) document.title = `${page.title} | Proluxury 普樂氏`
  }, [page])

  if (!page) return <NotFoundPage />

  return (
    <div className="page">
      <div className="container info-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={href('/')}>{t.breadcrumbHome}</a>
          <span>/</span>
          <strong>{page.title}</strong>
        </nav>

        <header className="page-head">
          <span className="kicker">{t.contactKicker}</span>
          <h1>{page.title}</h1>
          <p>{page.lead}</p>
        </header>

        <div className="info-sections">
          {page.sections.map((s) => (
            <section className="info-sec" key={s.h}>
              <h2>{s.h}</h2>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
