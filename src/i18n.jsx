import { createContext, useContext, useEffect, useState } from 'react'

const LangContext = createContext({ lang: 'zh', setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('pl-lang') || 'zh'
    } catch {
      return 'zh'
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem('pl-lang', lang)
    } catch { /* ignore */ }
    document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en'
  }, [lang])
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)

export const dict = {
  zh: {
    announce: 'Proluxury 普樂氏 — 品質家品・贴心生活　|　香港零售及售後服務支援',
    navProducts: '產品分類',
    navSummer: '夏季推介',
    navWinter: '冬季推介',
    navBrand: '品牌故事',
    searchPlaceholder: '搜尋產品名稱或型號…',
    searchHint: '輸入關鍵字搜尋，例如：風扇、RICE COOKER、PAF503060',
    searchNoResult: '找不到相符產品，請換個關鍵字試試。',
    searchPopular: '熱門搜尋',
    close: '關閉',
    langLabel: 'EN',
    heroCta: '了解更多',
    tilesKicker: '產品類別',
    tilesTitle: '選擇產品類別',
    tilesSub: '五大系列、十六個分類，總有一款貼合你的生活所需',
    itemsUnit: '件產品',
    featuredKicker: '精選推介',
    featuredTitle: '本季焦點',
    summerKicker: '季節推介',
    summerTitle: '夏日清涼之選',
    summerSub: '風扇、循環扇、USB 便攜風扇 — 全屋涼透透',
    winterKicker: '季節推介',
    winterTitle: '冬日暖意系列',
    winterSub: '陶瓷暖風機、暖爐 — 快速暖房，溫暖整個家',
    viewAll: '查看全部',
    viewProduct: '查看產品',
    brandKicker: '品牌故事',
    brandTitle: '普樂氏 PROLUXURY',
    brandLead: '為香港家庭而生的家品品牌',
    brandBody:
      '普樂氏多年來專注研發貼近日常的家品電器，由廚房電器、家居電器、個人護理到季節產品，' +
      '以實用設計、可靠品質與合理價格，照顧每個家庭的生活細節。',
    statProducts: '件產品',
    statCategories: '個產品分類',
    statSeries: '大產品系列',
    statService: '香港售後服務',
    brandCta: '認識我們的故事',
    footerAboutTitle: '關於普樂氏',
    footerAbout:
      'Proluxury 普樂氏為香港家品品牌，提供廚房電器、家居電器、個人護理及季節產品，' +
      '以貼心設計讓每個家更舒適。',
    footerProductsTitle: '產品分類',
    footerServiceTitle: '客戶服務',
    footerServiceLinks: ['聯絡我們', '送貨安排', '退換貨政策', '保養登記', '常見問題'],
    footerContactTitle: '聯絡我們',
    footerAddress: '香港九龍觀塘區',
    footerHotline: '客戶服務熱線：(852) 0000 0000',
    footerEmail: 'enquiry@proluxury.com.hk',
    footerHours: '星期一至五 09:00 - 18:00',
    footerDisclaimer: '本網站為前端示範版本，所有內容僅供內部體驗用途。',
    footerCopyright: '© 2026 Proluxury 普樂氏. 此為示範網站，版權資料僅供參考。',
    menuAll: '查看全部分類',
  },
  en: {
    announce: 'Proluxury — Quality Home Appliances for Everyday Living  |  HK Retail & After-sales Support',
    navProducts: 'Products',
    navSummer: 'Summer Picks',
    navWinter: 'Winter Warmth',
    navBrand: 'Our Story',
    searchPlaceholder: 'Search by product name or model no.…',
    searchHint: 'Type a keyword, e.g. FAN, RICE COOKER, PAF503060',
    searchNoResult: 'No matching products. Try another keyword.',
    searchPopular: 'Popular Searches',
    close: 'Close',
    langLabel: '中文',
    heroCta: 'Learn More',
    tilesKicker: 'Categories',
    tilesTitle: 'Choose a Category',
    tilesSub: '5 series and 16 categories — something for every corner of your home',
    itemsUnit: 'items',
    featuredKicker: 'Featured',
    featuredTitle: 'Season Highlights',
    summerKicker: 'Seasonal',
    summerTitle: 'Summer Cooling Picks',
    summerSub: 'Stand fans, circulators & USB portable fans — stay cool all summer',
    winterKicker: 'Seasonal',
    winterTitle: 'Winter Warmth Collection',
    winterSub: 'Ceramic heaters & fan heaters — warm up your home in minutes',
    viewAll: 'View All',
    viewProduct: 'View Product',
    brandKicker: 'Our Story',
    brandTitle: 'PROLUXURY',
    brandLead: 'A home appliance brand made for Hong Kong families',
    brandBody:
      'Proluxury designs practical home appliances for everyday life — from kitchen and home ' +
      'appliances to personal care and seasonal products, with reliable quality at fair prices.',
    statProducts: 'Products',
    statCategories: 'Categories',
    statSeries: 'Series',
    statService: 'HK After-sales Service',
    brandCta: 'Read Our Story',
    footerAboutTitle: 'About Proluxury',
    footerAbout:
      'Proluxury is a Hong Kong home appliance brand covering kitchen, home, personal care ' +
      'and seasonal products — thoughtful designs for a more comfortable home.',
    footerProductsTitle: 'Products',
    footerServiceTitle: 'Customer Service',
    footerServiceLinks: ['Contact Us', 'Delivery', 'Returns & Exchange', 'Warranty Registration', 'FAQ'],
    footerContactTitle: 'Contact Us',
    footerAddress: 'Kwun Tong, Kowloon, Hong Kong',
    footerHotline: 'Hotline: (852) 0000 0000',
    footerEmail: 'enquiry@proluxury.com.hk',
    footerHours: 'Mon–Fri 09:00 – 18:00',
    footerDisclaimer: 'This is a front-end demo site for internal review only.',
    footerCopyright: '© 2026 Proluxury. Demo website — content for reference only.',
    menuAll: 'View all categories',
  },
}
