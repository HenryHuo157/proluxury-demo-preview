import { useEffect } from 'react'
import { useLang, dict } from '../i18n.jsx'
import { totalProducts, categories, withImages, products } from '../lib/data.js'
import { href } from '../router.jsx'
import { IconChevronRight } from '../components/Icons.jsx'

export default function BrandPage() {
  const { lang } = useLang()
  const t = dict[lang]
  const subCount = categories.reduce((n, g) => n + g.subs.length, 0)
  const imgCount = withImages(products).length

  useEffect(() => {
    document.title = `${t.brandTitle} | Proluxury 普樂氏`
  }, [t.brandTitle])

  const stats = [
    { num: `${totalProducts}+`, label: t.statProducts },
    { num: `${subCount}`, label: t.statCategories },
    { num: `${categories.length}`, label: t.statSeries },
    { num: 'HK', label: t.statService },
  ]

  return (
    <div className="page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={href('/')}>{t.breadcrumbHome}</a>
          <span>/</span>
          <strong>{t.navBrand}</strong>
        </nav>

        <header className="page-head brand-head">
          <span className="kicker">{t.brandKicker}</span>
          <h1>{t.brandTitle}</h1>
          <p className="brand-page-lead">{t.brandLead}</p>
        </header>

        <div className="brand-page-body">
          <p>{t.brandBody}</p>
          <p>{t.brandPageBody}</p>
        </div>

        <div className="brand-stats brand-stats-page">
          {stats.map((s) => (
            <div className="brand-stat" key={s.label}>
              <strong>{s.num}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <section className="section">
          <div className="chips sub-chips">
            {categories.map((g) => (
              <a key={g.code} className="chip" href={href(`/category/${g.code}`)}>
                {lang === 'en' ? g.nameEn : g.nameZh}
                <em>{g.subs.length}</em>
                <IconChevronRight size={13} />
              </a>
            ))}
          </div>
          <p className="brand-page-note">
            {imgCount} / {totalProducts} {t.itemsUnit}
          </p>
        </section>

        <div className="brand-cta-row">
          <a className="btn" href={href('/products')}>
            {t.brandShopCta}
            <IconChevronRight size={15} />
          </a>
        </div>
      </div>
    </div>
  )
}
