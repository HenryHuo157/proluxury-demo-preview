import { useEffect, useState } from 'react'
import { useLang, dict } from '../i18n.jsx'
import { bySku, findCat, relatedOf, mainImg, productName, catName } from '../lib/data.js'
import { href } from '../router.jsx'
import ProductCard from '../components/ProductCard.jsx'
import LazyImage from '../components/LazyImage.jsx'
import SectionHead from '../components/Section.jsx'
import NotFoundPage from './NotFoundPage.jsx'

const MAX_THUMBS = 8

export default function ProductPage({ sku }) {
  const { lang } = useLang()
  const t = dict[lang]
  const p = bySku(sku)
  const found = p ? findCat(p.catCode) : null

  const [imgIdx, setImgIdx] = useState(0)
  useEffect(() => {
    setImgIdx(p && p.imgIdx >= 0 ? p.imgIdx : 0)
  }, [sku]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (p) document.title = `${productName(p, lang)} | Proluxury 普樂氏`
  }, [p, lang])

  if (!p) return <NotFoundPage />

  const group = found?.group
  const cat = found?.cat
  const name = productName(p, lang)
  const altName = lang === 'zh' ? p.nameEn : p.nameZh
  const desc = lang === 'en' ? p.descEn : p.descZh
  const specs = p.specs || []
  const attrs = p.attrs || []
  const thumbs = p.images.slice(0, MAX_THUMBS)
  const active = p.images[imgIdx] || mainImg(p)
  const related = relatedOf(p.sku, p.catCode, 8)

  return (
    <div className="page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={href('/')}>{t.breadcrumbHome}</a>
          <span>/</span>
          {group && <a href={href(`/category/${group.code}`)}>{catName(group, lang)}</a>}
          {group && <span>/</span>}
          {cat && cat !== group && (
            <>
              <a href={href(`/category/${cat.code}`)}>{catName(cat, lang)}</a>
              <span>/</span>
            </>
          )}
          <strong>{name}</strong>
        </nav>

        <div className="pd">
          <div className="pd-gallery">
            <div className="pd-main">
              <LazyImage key={active} src={active} alt={name} />
            </div>
            {thumbs.length > 1 && (
              <div className="pd-thumbs">
                {thumbs.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    className={`pd-thumb ${i === imgIdx ? 'active' : ''}`}
                    onClick={() => setImgIdx(i)}
                    aria-label={`${name} ${i + 1}`}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pd-info">
            <span className="kicker">{t.detailKicker}</span>
            <h1 className="pd-name">{name}</h1>
            {altName && <p className="pd-name-alt">{altName}</p>}
            <span className="pd-sku">
              {t.detailSku}：{p.sku}
            </span>

            {desc && (
              <section className="pd-sec">
                <h2>{t.detailDesc}</h2>
                <p>{desc}</p>
              </section>
            )}

            {attrs.length > 0 && (
              <section className="pd-sec">
                <h2>{t.detailFeatures}</h2>
                <table className="pd-attrs">
                  <tbody>
                    {attrs.map((a) => (
                      <tr key={a.k}>
                        <th>{a.k}</th>
                        <td>{a.v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {specs.length > 0 && (
              <section className="pd-sec">
                <h2>{t.detailSpecs}</h2>
                <ul className="pd-specs">
                  {specs.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="section pd-related">
            <SectionHead kicker={t.relatedKicker} title={t.relatedTitle} />
            <div className="pgrid">
              {related.map((r) => (
                <ProductCard key={r.sku} product={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
