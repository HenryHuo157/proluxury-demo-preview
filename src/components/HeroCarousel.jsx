import { useEffect, useRef, useState } from 'react'
import { useLang, dict } from '../i18n.jsx'
import { HERO_SLIDES } from '../lib/home.js'
import { bySku, mainImg } from '../lib/data.js'
import { IconChevronLeft, IconChevronRight } from './Icons.jsx'
import LazyImage from './LazyImage.jsx'

const AUTOPLAY_MS = 5500

export default function HeroCarousel() {
  const { lang } = useLang()
  const t = dict[lang]
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)

  const slides = HERO_SLIDES.map((s) => ({ ...s, product: bySku(s.sku) }))

  useEffect(() => {
    if (paused) return
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      AUTOPLAY_MS
    )
    return () => clearInterval(timer.current)
  }, [paused, slides.length])

  const go = (i) => setIndex((i + slides.length) % slides.length)

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((s, i) => (
        <div
          key={s.sku}
          className={`hero-slide theme-${s.theme} ${i === index ? 'active' : ''}`}
          aria-hidden={i !== index}
        >
          <div className="container hero-inner">
            <div className="hero-copy" key={`${s.sku}-${i === index}`}>
              <span className="hero-kicker">PROLUXURY HOME</span>
              <h1 className="hero-slogan">{s.slogan}</h1>
              <h2 className="hero-title">{lang === 'en' ? s.titleEn : s.titleZh}</h2>
              <p className="hero-sub">{lang === 'en' ? s.subEn : s.subZh}</p>
              <a className="btn btn-light" href="#featured">
                {t.heroCta}
                <IconChevronRight size={16} />
              </a>
            </div>
            <div className="hero-visual">
              <span className="hero-ring" aria-hidden="true" />
              <span className="hero-ring r2" aria-hidden="true" />
              <LazyImage
                src={s.product ? mainImg(s.product) : ''}
                alt={lang === 'en' ? s.titleEn : s.titleZh}
              />
            </div>
          </div>
        </div>
      ))}

      <button className="hero-arrow prev" onClick={() => go(index - 1)} aria-label="Previous">
        <IconChevronLeft />
      </button>
      <button className="hero-arrow next" onClick={() => go(index + 1)} aria-label="Next">
        <IconChevronRight />
      </button>

      <div className="hero-dots" role="tablist">
        {slides.map((s, i) => (
          <button
            key={s.sku}
            role="tab"
            aria-selected={i === index}
            className={i === index ? 'active' : ''}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
