import { useMemo } from 'react'
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
    <div className="filter-panel">
      <div className="fp-head">
        <strong>{t.filterTitle}</strong>
        {activeCount > 0 && (
          <button className="fp-reset" onClick={() => onChange({})}>
            {t.filterReset}
          </button>
        )}
      </div>
      {facets.map((f) => (
        <div className="fp-group" key={f.k}>
          <span className="fp-label">{f.k}</span>
          <div className="fp-opts">
            {f.options.map(([v, n]) => (
              <button
                key={v}
                className={`chip ${(selected[f.k] || []).includes(v) ? 'active' : ''}`}
                onClick={() => toggle(f.k, v)}
              >
                {v} <em>{n}</em>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
