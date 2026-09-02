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
    navAllProducts: '全部產品',
    pageAllProducts: '全部產品',
    productsSub: '由廚房到客廳，230+ 件家品電器任你選購',
    filterAll: '全部',
    breadcrumbHome: '主頁',
    detailKicker: '產品詳情',
    detailSku: '型號',
    detailDesc: '產品簡介',
    detailSpecs: '產品規格',
    detailFeatures: '產品特點',
    relatedKicker: '繼續選購',
    relatedTitle: '相關產品',
    contactKicker: '客戶服務',
    contactLead: '有任何查詢或意見，歡迎隨時與我們聯絡，我們會盡快回覆。',
    brandPageBody:
      '我們相信，好的家品不必昂貴。從研發、選料到售後服務，普樂氏以香港家庭的實際需要出發，' +
      '讓每一天的生活都更輕鬆、更安心。',
    brandShopCta: '瀏覽全部產品',
    notFoundTitle: '找不到頁面',
    notFoundBody: '你前往的頁面不存在或已被移動，請返回主頁繼續瀏覽。',
    backHome: '返回主頁',
    infoPages: {
      delivery: {
        title: '送貨安排',
        lead: '我們為香港、九龍及新界客戶提供送貨服務，下單後會盡快安排出貨。',
        sections: [
          { h: '送貨範圍', body: '送貨服務覆蓋香港、九龍、新界及部分離島地區。偏遠地區或需收取附加費，出貨前客服會與你確認。' },
          { h: '送貨時間', body: '一般現貨產品於確認訂單後 3–7 個工作天內送達。個別大型產品或需另行預約送貨時間。' },
          { h: '運費說明', body: '訂單金額滿指定金額可享免運費優惠，未滿者酌收基本運費，實際金額以結帳頁面為準。' },
          { h: '收貨提醒', body: '收貨時請當場檢查產品外包裝是否完好，如有破損請即場向送貨人員反映或聯絡客戶服務熱線。' },
        ],
      },
      returns: {
        title: '退換貨政策',
        lead: '如產品出現問題，我們會按以下政策為你安排退換。',
        sections: [
          { h: '七日有壞包換', body: '產品由收貨日起計 7 日內如出現非人為損壞之故障，可憑單據聯絡客戶服務安排更換。' },
          { h: '退換條件', body: '產品須保持原有包裝及配件齊全，並附上有效購買單據。人為損壞、不正確使用或未經授權拆修將不獲受理。' },
          { h: '退款安排', body: '符合退款條件的個案將於確認後 14 個工作天內，按原付款方式退回款項。' },
        ],
      },
      warranty: {
        title: '保養登記',
        lead: '完成保養登記，享有原廠保養及優先售後支援。',
        sections: [
          { h: '保養期', body: '一般家品電器享有一年原廠保養，個別產品保養期或有不同，請以產品說明書為準。' },
          { h: '登記方法', body: '保留購買單據並填寫產品內的保養卡，或透過客戶服務熱線 / 電郵提供型號及購買日期完成登記。' },
          { h: '保養範圍', body: '保養涵蓋正常使用下的材料及工藝缺陷，不包括耗材、人為損壞、意外或不當使用。' },
        ],
      },
      faq: {
        title: '常見問題',
        lead: '整理客戶最常查詢的問題，幫你快速找到答案。',
        sections: [
          { h: '如何選購產品？', body: '你可以透過「產品分類」按類別瀏覽，或在搜尋欄輸入產品名稱或型號直接查找。' },
          { h: '產品可以按摩托車運送嗎？', body: '大型家品會安排專車送貨；小型產品則以速遞寄送，送貨方式會於訂單確認時說明。' },
          { h: '哪裡可以查詢保養狀態？', body: '歡迎致電客戶服務熱線或電郵 enquiry@proluxury.com.hk，提供型號及購買單據即可查詢。' },
        ],
      },
    },
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
    navAllProducts: 'All Products',
    pageAllProducts: 'All Products',
    productsSub: '230+ home appliances for every corner of your home',
    filterAll: 'All',
    breadcrumbHome: 'Home',
    detailKicker: 'Product Details',
    detailSku: 'Model No.',
    detailDesc: 'Product Description',
    detailSpecs: 'Specifications',
    detailFeatures: 'Features',
    relatedKicker: 'Keep Browsing',
    relatedTitle: 'Related Products',
    contactKicker: 'Customer Service',
    contactLead: 'Questions or feedback? Get in touch and we will reply as soon as we can.',
    brandPageBody:
      'We believe good home appliances should not cost a fortune. From R&D and materials to ' +
      'after-sales service, Proluxury is built around the real needs of Hong Kong families — ' +
      'making everyday life a little easier.',
    brandShopCta: 'Browse All Products',
    notFoundTitle: 'Page Not Found',
    notFoundBody: 'The page you are looking for does not exist or has moved.',
    backHome: 'Back to Home',
    infoPages: {
      delivery: {
        title: 'Delivery',
        lead: 'We deliver across Hong Kong Island, Kowloon and the New Territories.',
        sections: [
          { h: 'Coverage', body: 'Delivery covers Hong Kong Island, Kowloon, the New Territories and selected outlying islands. A surcharge may apply to remote areas — our team will confirm before dispatch.' },
          { h: 'Delivery Time', body: 'In-stock items are generally delivered within 3–7 working days after order confirmation. Larger products may require a scheduled delivery slot.' },
          { h: 'Shipping Fee', body: 'Orders above the specified amount enjoy free delivery; otherwise a basic shipping fee applies as shown at checkout.' },
          { h: 'On Arrival', body: 'Please inspect the packaging on delivery. If it is damaged, notify the courier on the spot or contact our service hotline.' },
        ],
      },
      returns: {
        title: 'Returns & Exchange',
        lead: 'If something goes wrong, we will arrange a return or exchange under this policy.',
        sections: [
          { h: '7-Day Exchange', body: 'If a product fails within 7 days of receipt due to non-human damage, contact customer service with your receipt to arrange an exchange.' },
          { h: 'Conditions', body: 'Products must be returned with original packaging and all accessories, together with a valid receipt. Damage caused by misuse, accidents or unauthorised repair is not covered.' },
          { h: 'Refunds', body: 'Approved refunds will be returned via the original payment method within 14 working days after confirmation.' },
        ],
      },
      warranty: {
        title: 'Warranty Registration',
        lead: 'Register your product to enjoy manufacturer warranty and priority after-sales support.',
        sections: [
          { h: 'Warranty Period', body: 'Most home appliances carry a one-year manufacturer warranty. Individual products may differ — see the product manual for details.' },
          { h: 'How to Register', body: 'Keep your receipt and complete the warranty card inside the box, or register via our service hotline / email with the model number and purchase date.' },
          { h: 'Coverage', body: 'The warranty covers defects in materials and workmanship under normal use. Consumables, misuse, accidents and improper handling are excluded.' },
        ],
      },
      faq: {
        title: 'FAQ',
        lead: 'Answers to the questions our customers ask most.',
        sections: [
          { h: 'How do I find a product?', body: 'Browse by category under Products, or search directly by product name or model number.' },
          { h: 'How are products delivered?', body: 'Large appliances are delivered by dedicated van; smaller items are shipped by courier. The method is confirmed when your order is placed.' },
          { h: 'Where can I check my warranty?', body: 'Call our service hotline or email enquiry@proluxury.com.hk with the model number and receipt to check your warranty status.' },
        ],
      },
    },
  },
}
