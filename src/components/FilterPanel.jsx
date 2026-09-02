import { useEffect, useMemo, useRef, useState } from 'react'
import { useLang, dict } from '../i18n.jsx'

const PLACEHOLDER = new Set(['未指定', '不適用', '不适用', '未標明', '無特別功能', '—'])
const MAX_GROUPS = 6

export function applyFacets(list, selected) {
  const entries = Object.entries(selected)
  if (!entries.length) return list
  return list.filter((p) =>
    entries.every(([k, vals]) =>
      (p.attrs || []).some((a) => a.k === k && vals.includes(String(a.v || '').trim()))
    )
  )
}

export default function FilterPanel({ list, selected, onChange }) {
  const { lang } = useLang()
  const t = dict[lang]
  const rootRef = useRef(null)
  const [openK, setOpenK] = useState(null)

  const facets = useMemo(() => {
    const groups = new Map()
    list.forEach((p) =>
      (p.attrs || []).forEach((a) => {
        const v = String(a.v || '').trim()
        if (!v || PLACEHOLDER.has(v)) return
        if (!groups.has(a.k)) groups.set(a.k, { count: 0, values: new Map() })
        const g = groups.get(a.k)
        g.count += 1
        g.values.set(v, (g.values.get(v) || 0) + 1)
      })
    )
    return [...groups.entries()]
      .map(([k, g]) => ({
        k,
        count: g.count,
        options: [...g.values.entries()].sort(
          (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-Hant')
        ),
      }))
      .filter((f) => f.options.length > 1)
      .sort((a, b) => b.count - a.count)
      .slice(0, MAX_GROUPS)
  }, [list])

  useEffect(() => {
    if (!openK) return
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpenK(null)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenK(null)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openK])

  if (!facets.length) return null

  const toggle = (k, v) => {
    const cur = new Set(selected[k] || [])
    if (cur.has(v)) cur.delete(v)
    else cur.add(v)
    const next = { ...selected }
    if (cur.size) next[k] = [...cur]
    else delete next[k]
    onChange(next)
  }

  const activeCount = Object.values(selected).reduce((n, s) => n + s.length, 0)

  return (
    <div className="fb-wrap" ref={rootRef}>
      <div className="fb-bar">
        <span className="fb-title">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
            <circle cx="15" cy="7" r="2" />
            <circle cx="9" cy="17" r="2" />
          </svg>
          {t.filterTitle}
        </span>
        {facets.map((f) => {
          const sel = selected[f.k] || []
          const isOpen = openK === f.k
          return (
            <div className={`fb-dd ${isOpen ? 'open' : ''}`} key={f.k}>
              <button
                type="button"
                className={`fb-btn ${sel.length ? 'active' : ''}`}
                aria-expanded={isOpen}
                onClick={() => setOpenK(isOpen ? null : f.k)}
              >
                {f.k}
                {sel.length > 0 && <b>{sel.length}</b>}
                <svg
                  className="fb-caret"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {isOpen && (
                <div className="fb-menu">
                  {f.options.map(([v, n]) => {
                    const checked = sel.includes(v)
                    return (
                      <label className={`fb-opt ${checked ? 'checked' : ''}`} key={v}>
                        <input type="checkbox" checked={checked} onChange={() => toggle(f.k, v)} />
                        <span>{v}</span>
                        <em>{n}</em>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
        {activeCount > 0 && (
          <button type="button" className="fb-clear" onClick={() => onChange({})}>
            {t.filterReset}
          </button>
        )}
      </div>
      {activeCount > 0 && (
        <div className="fb-chips">
          {Object.entries(selected).map(([k, vals]) =>
            vals.map((v) => (
              <button
                type="button"
                className="fb-chip"
                key={`${k} ${v}`}
                onClick={() => toggle(k, v)}
              >
                <small>{k}:</small>
                {v}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
