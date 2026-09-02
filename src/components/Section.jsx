import { useLang, dict } from '../i18n.jsx'

/** 標準區塊標題：紅色 kicker + 大標（繁中）+ 副標 */
export default function SectionHead({ kicker, title, sub, light = false }) {
  const { lang } = useLang()
  const t = dict[lang]
  return (
    <div className={`section-head ${light ? 'light' : ''}`}>
      <span className="kicker">{kicker || t.featuredKicker}</span>
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  )
}
