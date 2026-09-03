import { useLang, dict } from '../i18n.jsx'
import { categories, catName, heroProductOfCat, mainImg } from '../lib/data.js'
import SectionHead from './Section.jsx'
import LazyImage from './LazyImage.jsx'
import Reveal from './Reveal.jsx'

export default function CategoryTiles() {
  const { lang } = useLang()
  const t = dict[lang]
  let tileIndex = 0
  return (
    <section className="section tiles-section" id="categories">
      <div className="container">
        <Reveal>
          <SectionHead kicker={t.tilesKicker} title={t.tilesTitle} sub={t.tilesSub} />
        </Reveal>
        <div className="tiles">
          {categories.flatMap((g) =>
            g.subs.map((s) => {
              const rep = heroProductOfCat(s.code)
              const delay = Math.min(tileIndex++ * 45, 400)
              return (
                <Reveal as="a" className="tile" href={`#/category/${s.code}`} key={s.code} delay={delay}>
                  <div className="tile-img">
                    <LazyImage src={rep ? mainImg(rep) : ''} alt={catName(s, lang)} />
                  </div>
                  <div className="tile-info">
                    <strong>{catName(s, lang)}</strong>
                    <span>{s.count} {t.itemsUnit}</span>
                  </div>
                </Reveal>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
