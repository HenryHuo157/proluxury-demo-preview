import { useEffect } from 'react'
import { useLang, dict } from '../i18n.jsx'
import { findCat, productsOfCat, catName } from '../lib/data.js'
import { href } from '../router.jsx'
import ProductCard from '../components/ProductCard.jsx'
import NotFoundPage from './NotFoundPage.jsx'

export default function CategoryPage({ code }) {
  const { lang } = useLang()
  const t = dict[lang]
  const found = findCat(code)

  useEffect(() => {
    if (found) document.title = `${catName(found.cat, lang)} | Proluxury 普樂氏`
  }, [found, lang])

  if (!found) return <NotFoundPage />

  const { cat, group } = found
  const isGroup = cat === group
  const list = productsOfCat(code).sort(
    (a, b) => b.images.length - a.images.length || a.sku.localeCompare(b.sku)
  )

  return (
    <div className="page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={href('/')}>{t.breadcrumbHome}</a>
          <span>/</span>
          {!isGroup && <a href={href(`/category/${group.code}`)}>{catName(group, lang)}</a>}
          {!isGroup && <span>/</span>}
          <strong>{catName(cat, lang)}</strong>
        </nav>

        <header className="page-head">
          <span className="kicker">{catName(group, lang)}</span>
          <h1>{catName(cat, lang)}</h1>
          <p>
            {list.length} {t.itemsUnit}
          </p>
        </header>

        {isGroup && (
          <div className="chips sub-chips">
            {group.subs.map((s) => (
              <a key={s.code} className="chip" href={href(`/category/${s.code}`)}>
                {catName(s, lang)} <em>{s.count}</em>
              </a>
            ))}
          </div>
        )}

        {list.length ? (
          <div className="pgrid">
            {list.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        ) : (
          <p className="shop-empty">{t.searchNoResult}</p>
        )}
      </div>
    </div>
  )
}
