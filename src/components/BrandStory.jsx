import { useLang, dict } from '../i18n.jsx'
import { totalProducts, categories } from '../lib/data.js'
import { IconChevronRight } from './Icons.jsx'

export default function BrandStory() {
  const { lang } = useLang()
  const t = dict[lang]
  const subCount = categories.reduce((n, g) => n + g.subs.length, 0)
  const stats = [
    { num: `${totalProducts}+`, label: t.statProducts },
    { num: `${subCount}`, label: t.statCategories },
    { num: `${categories.length}`, label: t.statSeries },
    { num: 'HK', label: t.statService },
  ]
  return (
    <section className="section brand-section" id="brand">
      <div className="container brand-inner">
        <span className="kicker light">{t.brandKicker}</span>
        <h2 className="brand-title">{t.brandTitle}</h2>
        <p className="brand-lead">{t.brandLead}</p>
        <p className="brand-body">{t.brandBody}</p>
        <div className="brand-stats">
          {stats.map((s) => (
            <div className="brand-stat" key={s.label}>
              <strong>{s.num}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <a className="btn btn-light brand-cta" href="#categories">
          {t.brandCta}
          <IconChevronRight size={15} />
        </a>
      </div>
    </section>
  )
}
