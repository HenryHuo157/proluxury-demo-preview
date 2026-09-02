import { useLang, dict } from '../i18n.jsx'
import { topOfCat } from '../lib/data.js'
import HeroCarousel from '../components/HeroCarousel.jsx'
import CategoryTiles from '../components/CategoryTiles.jsx'
import FeaturedBlocks from '../components/FeaturedBlocks.jsx'
import ProductRow from '../components/ProductRow.jsx'
import BrandStory from '../components/BrandStory.jsx'

export default function Home() {
  const { lang } = useLang()
  const t = dict[lang]
  const summerItems = topOfCat('ED01', 8)
  const winterItems = topOfCat('ED02', 8)

  return (
    <>
      <HeroCarousel />
      <CategoryTiles />
      <FeaturedBlocks />
      <ProductRow
        id="summer"
        moreHref="/category/ED01"
        kicker={t.summerKicker}
        title={t.summerTitle}
        sub={t.summerSub}
        items={summerItems}
      />
      <ProductRow
        id="winter"
        moreHref="/category/ED02"
        kicker={t.winterKicker}
        title={t.winterTitle}
        sub={t.winterSub}
        items={winterItems}
      />
      <BrandStory />
    </>
  )
}
