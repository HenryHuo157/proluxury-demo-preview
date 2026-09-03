import { useLang, dict } from '../i18n.jsx'
import { FEATURED_BLOCKS } from '../lib/home.js'
import { bySku, mainImg } from '../lib/data.js'
import SectionHead from './Section.jsx'
import LazyImage from './LazyImage.jsx'
import Reveal from './Reveal.jsx'
import { IconChevronRight } from './Icons.jsx'

export default function FeaturedBlocks() {
  const { lang } = useLang()
  const t = dict[lang]
  return (
    <section className="section featured-section" id="featured">
      <div className="container">
        <Reveal>
          <SectionHead kicker={t.featuredKicker} title={t.featuredTitle} />
        </Reveal>
        <div className="featured-list">
          {FEATURED_BLOCKS.map((f, i) => {
            const p = bySku(f.sku)
            const imgFirst = i % 2 === 1 // 第二塊圖在左
            return (
              <Reveal
                as="article"
                className={`fblock theme-${f.theme} ${imgFirst ? 'img-first' : ''}`}
                key={f.sku}
              >
                <div className="fblock-copy">
                  <span className="fblock-slogan">{f.slogan}</span>
                  <h3 className="fblock-title">{lang === 'en' ? f.titleEn : f.titleZh}</h3>
                  <p className="fblock-body">{lang === 'en' ? f.bodyEn : f.bodyZh}</p>
                  <a className="btn" href={`#/product/${f.sku}`}>
                    {t.heroCta}
                    <IconChevronRight size={15} />
                  </a>
                </div>
                <div className="fblock-visual">
                  <span className="fblock-plate" aria-hidden="true" />
                  <LazyImage src={p ? mainImg(p) : ''} alt={p?.nameZh || f.titleZh} />
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
