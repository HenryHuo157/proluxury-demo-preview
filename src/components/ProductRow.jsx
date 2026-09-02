import { useRef } from 'react'
import { useLang, dict } from '../i18n.jsx'
import SectionHead from './Section.jsx'
import ProductCard from './ProductCard.jsx'
import { IconChevronLeft, IconChevronRight, IconArrowRight } from './Icons.jsx'

/** 橫向滾動商品列（季節推介） */
export default function ProductRow({ id, kicker, title, sub, items, moreHref }) {
  const { lang } = useLang()
  const t = dict[lang]
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  if (!items?.length) return null
  return (
    <section className="section prow-section" id={id}>
      <div className="container">
        <div className="prow-head">
          <SectionHead kicker={kicker} title={title} sub={sub} />
          <div className="prow-actions">
            <a className="link-more" href={moreHref ? `#${moreHref}` : '#/products'}>
              {t.viewAll} <IconArrowRight size={15} />
            </a>
            <div className="prow-arrows">
              <button className="icon-btn" onClick={() => scrollBy(-1)} aria-label="Scroll left">
                <IconChevronLeft />
              </button>
              <button className="icon-btn" onClick={() => scrollBy(1)} aria-label="Scroll right">
                <IconChevronRight />
              </button>
            </div>
          </div>
        </div>
        <div className="prow-track" ref={trackRef}>
          {items.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
