import Header from './components/Header.jsx'
import HeroCarousel from './components/HeroCarousel.jsx'
import CategoryTiles from './components/CategoryTiles.jsx'
import FeaturedBlocks from './components/FeaturedBlocks.jsx'
import ProductRow from './components/ProductRow.jsx'
import BrandStory from './components/BrandStory.jsx'
import Footer from './components/Footer.jsx'
import { useLang, dict } from './i18n.jsx'
import { topOfCat } from './lib/data.js'

export default function App() {
  const { lang } = useLang()
  const t = dict[lang]
  const summerItems = topOfCat('ED01', 8)
  const winterItems = topOfCat('ED02', 8)

  return (
    <div className="site" id="top">
      <Header />
      <main>
        <HeroCarousel />
        <CategoryTiles />
        <FeaturedBlocks />
        <ProductRow
          id="summer"
          kicker={t.summerKicker}
          title={t.summerTitle}
          sub={t.summerSub}
          items={summerItems}
        />
        <ProductRow
          id="winter"
          kicker={t.winterKicker}
          title={t.winterTitle}
          sub={t.winterSub}
          items={winterItems}
        />
        <BrandStory />
      </main>
      <Footer />
    </div>
  )
}
