import { useEffect, useMemo, useState } from 'react'
import { useLang, dict } from '../i18n.jsx'
import { products, categories, catName, withImages } from '../lib/data.js'
import { href } from '../router.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { IconSearch } from '../components/Icons.jsx'

export default function ProductsPage() {
  const { lang } = useLang()
  const t = dict[lang]
  const [group, setGroup] = useState('')
  const [q, setQ] = useState('')

  useEffect(() => {
    document.title = `${t.pageAllProducts} | Proluxury 普樂氏`
  }, [t.pageAllProducts])

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return withImages(products).filter((p) => {
      if (group && !p.catCode.startsWith(group)) return false
      if (
        kw &&
        !p.nameZh.toLowerCase().includes(kw) &&
        !(p.nameEn || '').toLowerCase().includes(kw) &&
        !p.sku.toLowerCase().includes(kw)
      ) {
        return false
      }
      return true
    })
  }, [group, q])

  return (
    <div className="page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={href('/')}>{t.breadcrumbHome}</a>
          <span>/</span>
          <strong>{t.pageAllProducts}</strong>
        </nav>

        <header className="page-head">
          <span className="kicker">{t.detailKicker}</span>
          <h1>{t.pageAllProducts}</h1>
          <p>{t.productsSub}</p>
        </header>

        <div className="shop-toolbar">
          <div className="chips">
            <button
              className={`chip ${group === '' ? 'active' : ''}`}
              onClick={() => setGroup('')}
            >
              {t.filterAll}
            </button>
            {categories.map((g) => (
              <button
                key={g.code}
                className={`chip ${group === g.code ? 'active' : ''}`}
                onClick={() => setGroup(g.code)}
              >
                {catName(g, lang)}
              </button>
            ))}
          </div>
          <div className="shop-search">
            <IconSearch size={17} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
            />
          </div>
        </div>

        <p className="shop-count">
          {list.length} {t.itemsUnit}
        </p>

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
