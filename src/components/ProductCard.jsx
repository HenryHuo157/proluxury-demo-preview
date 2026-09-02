import { useLang, dict } from '../i18n.jsx'
import { productName, categories, catName, mainImg } from '../lib/data.js'
import { IconArrowRight } from './Icons.jsx'
import LazyImage from './LazyImage.jsx'

const subByCode = Object.fromEntries(
  categories.flatMap((g) => g.subs.map((s) => [s.code, s]))
)

export default function ProductCard({ product }) {
  const { lang } = useLang()
  const t = dict[lang]
  const sub = subByCode[product.catCode]
  return (
    <a className="pcard" href="#categories">
      <div className="pcard-img">
        <LazyImage src={mainImg(product)} alt={product.nameZh} />
        {sub && <span className="pcard-cat">{catName(sub, lang)}</span>}
      </div>
      <div className="pcard-body">
        <h3 className="pcard-name">{productName(product, lang)}</h3>
        <p className="pcard-name-en">{lang === 'zh' ? product.nameEn : product.nameZh}</p>
        <span className="pcard-cta">
          {t.viewProduct}
          <IconArrowRight size={14} />
        </span>
      </div>
    </a>
  )
}
