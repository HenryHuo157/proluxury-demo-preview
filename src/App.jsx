import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { useRoute } from './router.jsx'
import Home from './pages/Home.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import BrandPage from './pages/BrandPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import InfoPage from './pages/InfoPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  const parts = useRoute()
  const [root, param] = parts

  let page
  if (!root) {
    page = <Home />
  } else if (root === 'products') {
    page = <ProductsPage />
  } else if (root === 'category') {
    page = <CategoryPage code={param || ''} />
  } else if (root === 'product') {
    page = <ProductPage sku={param || ''} />
  } else if (root === 'brand') {
    page = <BrandPage />
  } else if (root === 'contact') {
    page = <ContactPage />
  } else if (root === 'info') {
    page = <InfoPage slug={param || ''} />
  } else {
    page = <NotFoundPage />
  }

  return (
    <div className="site" id="top">
      <Header />
      <main>{page}</main>
      <Footer />
    </div>
  )
}
