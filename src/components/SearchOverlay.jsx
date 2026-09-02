import { useEffect, useMemo, useRef, useState } from 'react'
import { useLang, dict } from '../i18n.jsx'
import { products, productName, mainImg } from '../lib/data.js'
import { IconClose, IconSearch } from './Icons.jsx'
import LazyImage from './LazyImage.jsx'

const POPULAR = ['風扇', '電飯煲', '氣炸鍋', '暖風機', '吸塵機']
const POPULAR_EN = ['Fan', 'Rice Cooker', 'Air Fryer', 'Heater', 'Vacuum']

export default function SearchOverlay({ open, onClose }) {
  const { lang } = useLang()
  const t = dict[lang]
  const [q, setQ] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const results = useMemo(() => {
    const kw = q.trim().toLowerCase()
    if (!kw) return []
    return products
      .filter((p) =>
        p.nameZh.toLowerCase().includes(kw) ||
        (p.nameEn || '').toLowerCase().includes(kw) ||
        p.sku.toLowerCase().includes(kw)
      )
      .slice(0, 6)
  }, [q])

  if (!open) return null
  return (
    <div className="search-overlay" role="dialog" aria-label="Search">
      <div className="search-backdrop" onClick={onClose} />
      <div className="search-panel container">
        <div className="search-bar">
          <IconSearch size={22} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
          />
          <button className="icon-btn" onClick={onClose} aria-label={t.close}>
            <IconClose />
          </button>
        </div>

        {!q.trim() ? (
          <div className="search-hint">
            <p>{t.searchHint}</p>
            <div className="search-popular">
              <span>{t.searchPopular}：</span>
              {(lang === 'zh' ? POPULAR : POPULAR_EN).map((w) => (
                <button key={w} onClick={() => setQ(w)}>{w}</button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="search-empty">{t.searchNoResult}</p>
        ) : (
          <ul className="search-results">
            {results.map((p) => (
              <li key={p.sku}>
                <LazyImage src={mainImg(p)} alt={p.nameZh} />
                <div className="sr-info">
                  <strong>{productName(p, lang)}</strong>
                  <span>{p.sku}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
