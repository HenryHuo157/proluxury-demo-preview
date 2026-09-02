import { useLang, dict } from '../i18n.jsx'
import { categories, catName, heroProductOfCat, mainImg } from '../lib/data.js'
import SectionHead from './Section.jsx'
import LazyImage from './LazyImage.jsx'

export default function CategoryTiles() {
  const { lang } = useLang()
  const t = dict[lang]
  return (
    <section className="section tiles-section" id="categories">
      <div className="container">
        <SectionHead kicker={t.tilesKicker} title={t.tilesTitle} sub={t.tilesSub} />
        <div className="tiles">
          {categories.flatMap((g) =>
            g.subs.map((s) => {
              const rep = heroProductOfCat(s.code)
              return (
                <a className="tile" href="#categories" key={s.code}>
                  <div className="tile-img">
                    <LazyImage src={rep ? mainImg(rep) : ''} alt={catName(s, lang)} />
                  </div>
                  <div className="tile-info">
                    <strong>{catName(s, lang)}</strong>
                    <span>{s.count} {t.itemsUnit}</span>
                  </div>
                </a>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
