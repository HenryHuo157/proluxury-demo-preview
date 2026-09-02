import productsRaw from '../data/products.json'
import categoriesRaw from '../data/categories.json'

export const products = productsRaw
export const categories = categoriesRaw.groups
export const totalProducts = categoriesRaw.total

export const bySku = (sku) => products.find((p) => p.sku === sku)

export const byCat = (code) => products.filter((p) => p.catCode === code)

/** 商品主圖（數據腳本已驗證可載入） */
export const mainImg = (p) =>
  p.images[p.imgIdx >= 0 ? p.imgIdx : 0] || p.images[0] || ''

/** 圖片可用的商品 */
export const withImages = (list) => list.filter((p) => p.imgIdx >= 0 && p.images.length)

/** 分類代表商品（圖最多者優先，作為磁貼/選單縮圖） */
export const heroProductOfCat = (code) =>
  withImages(byCat(code)).sort((a, b) => b.images.length - a.images.length)[0] || null

/** 依語言取商品名 */
export const productName = (p, lang) => (lang === 'en' ? p.nameEn || p.nameZh : p.nameZh)

/** 依語言取分類名 */
export const catName = (obj, lang) => (lang === 'en' ? obj.nameEn : obj.nameZh)

/** 季節列商品：有圖、按圖片數排序，取前 n 個 */
export const topOfCat = (code, n = 8) =>
  withImages(byCat(code))
    .sort((a, b) => b.images.length - a.images.length || a.sku.localeCompare(b.sku))
    .slice(0, n)
