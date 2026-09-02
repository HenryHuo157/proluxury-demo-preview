import { useEffect, useRef, useState } from 'react'
import { useLang, dict } from '../i18n.jsx'
import { categories, catName, heroProductOfCat, mainImg } from '../lib/data.js'
import { HERO_SLIDES } from '../lib/home.js'
import logoImg from '../Logo/Logo2.png'
import {
  IconMenu, IconClose, IconSearch, IconChevronDown, IconArrowRight,
} from './Icons.jsx'
import LazyImage from './LazyImage.jsx'
import SearchOverlay from './SearchOverlay.jsx'

function Logo({ compact = false }) {
  return (
    <a className="logo" href="#/" aria-label="Proluxury 普樂氏">
      <img
        className={`logo-img ${compact ? 'logo-img-compact' : ''}`}
        src={logoImg}
        alt="Proluxury 普樂氏"
      />
    </a>
  )
}

function MegaMenu() {
  const { lang } = useLang()
  const t = dict[lang]
  const promoProduct = heroProductOfCat('EA06') // 智能空氣炸鍋
  const promo = HERO_SLIDES[0]
  return (
    <div className="mega" role="navigation">
      <div className="mega-inner container">
        <a
          className="mega-promo"
          href={promoProduct ? `#/product/${promoProduct.sku}` : '#/products'}
        >
          <span className="mega-promo-slogan">{promo.slogan}</span>
          <LazyImage src={promoProduct ? mainImg(promoProduct) : ''} alt={promoProduct?.nameZh || ''} />
          <span className="mega-promo-name">
            {lang === 'en' ? promo.titleEn : promo.titleZh}
          </span>
          <span className="mega-promo-cta">
            {t.heroCta} <IconArrowRight size={16} />
          </span>
        </a>
        <div className="mega-cols">
          {categories.map((g) => (
            <div className="mega-col" key={g.code}>
              <a className="mega-group" href={`#/category/${g.code}`}>
                {catName(g, lang)}
              </a>
              {g.subs.map((s) => (
                <a key={s.code} className="mega-sub" href={`#/category/${s.code}`}>
                  {catName(s, lang)}
                  <em>{s.count}</em>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileDrawer({ open, onClose }) {
  const { lang } = useLang()
  const t = dict[lang]
  const [openGroup, setOpenGroup] = useState(null)
  return (
    <div className={`drawer ${open ? 'is-open' : ''}`} role="dialog" aria-label="Menu">
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel">
        <div className="drawer-head">
          <Logo compact />
          <button className="icon-btn" onClick={onClose} aria-label={t.close}>
            <IconClose />
          </button>
        </div>
        <nav className="drawer-nav">
          {categories.map((g) => (
            <div className="drawer-group" key={g.code}>
              <button
                className="drawer-group-btn"
                aria-expanded={openGroup === g.code}
                onClick={() => setOpenGroup(openGroup === g.code ? null : g.code)}
              >
                {catName(g, lang)}
                <IconChevronDown size={16} className={`chev ${openGroup === g.code ? 'up' : ''}`} />
              </button>
              {openGroup === g.code && (
                <div className="drawer-subs">
                  {g.subs.map((s) => (
                    <a key={s.code} href={`#/category/${s.code}`} onClick={onClose}>
                      {catName(s, lang)} <em>{s.count}</em>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a className="drawer-link" href="#/products" onClick={onClose}>{t.navAllProducts}</a>
          <a className="drawer-link" href="#/category/ED01" onClick={onClose}>{t.navSummer}</a>
          <a className="drawer-link" href="#/category/ED02" onClick={onClose}>{t.navWinter}</a>
          <a className="drawer-link" href="#/brand" onClick={onClose}>{t.navBrand}</a>
        </nav>
      </div>
    </div>
  )
}

export default function Header() {
  const { lang, setLang } = useLang()
  const t = dict[lang]
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const megaTimer = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openMega = () => { clearTimeout(megaTimer.current); setMegaOpen(true) }
  const closeMega = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 120) }

  return (
    <>
      <div className="announce">
        <div className="container announce-inner">
          <span>{t.announce}</span>
        </div>
      </div>

      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-main">
          <button
            className="icon-btn burger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <IconMenu />
          </button>

          <Logo />

          <nav className="main-nav" aria-label="Main">
            <div
              className={`nav-item has-mega ${megaOpen ? 'open' : ''}`}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button className="nav-link" aria-expanded={megaOpen}>
                {t.navProducts}
                <IconChevronDown size={15} />
              </button>
            </div>
            <a className="nav-link" href="#/category/ED01">{t.navSummer}</a>
            <a className="nav-link" href="#/category/ED02">{t.navWinter}</a>
            <a className="nav-link" href="#/brand">{t.navBrand}</a>
          </nav>

          <div className="header-tools">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <IconSearch />
            </button>
            <button
              className="lang-btn"
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              aria-label="Switch language"
            >
              {t.langLabel}
            </button>
          </div>
        </div>

        {megaOpen && <MegaMenu />}
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
