# Proluxury 普樂氏 — 家品網站 Demo（首頁）

對標 [東芝 HK 生活家電站](https://www.toshiba-lifestyle.com/hk) 風格的前端示範網站。
商品資料來自《只有Proluxury SKU.csv》（230 個 SKU），圖片直連 filedn.com 圖床。

> 本倉庫為**前端 Demo**，僅供內部體驗設計效果，無後端、無交易功能。

## 快速開始

```bash
npm install
npm run dev        # 打開 http://localhost:5173
```

## 數據管線

`scripts/build-data.mjs` 將 CSV 轉成前端 JSON（`src/data/products.json`、`categories.json`），並做以下清洗：

- 圖片 URL 反斜線 → `/`，空格 → `%20`
- 品牌名統一「普樂氏」；去除名稱開頭 `**` / `!` 標記及內嵌換行
- 篩選屬性（條件1–6）簡體 → 繁體
- **檢查每個商品前 3 張圖片的可用性**（filedn 有部分 404），記錄首張可用圖 `imgIdx`

```bash
npm run data               # 完整重建（含圖片檢查，約 1 分鐘）
npm run data -- --skip-check   # 快速重建（跳過圖片檢查）
```

原始 CSV / xlsx 屬業務檔案，已透過 `.gitignore` 排除，不會入庫。

## 技術棧

- [Vite](https://vitejs.dev/) + React 18
- 純 CSS（無 UI 框架），繁中/EN 雙語即時切換（`src/i18n.jsx`）
- 圖片：懶加載 + 載入失敗佔位圖（`src/components/LazyImage.jsx`）

## 目前進度（首頁里程碑）

- [x] 公告欄 + Header（Mega Menu 五大類 16 子類、搜尋、中/EN 切換）
- [x] Hero 輪播（4 張雙語口號 banner，自動播放）
- [x] 「選擇產品類別」16 宮格分類磁貼
- [x] 精選推介（咖啡機 / 吸塵機交替大圖區）
- [x] 夏季 / 冬季商品橫向卡列（真實商品 + 圖片）
- [x] 品牌故事（深藍統計區）+ Footer
- [x] 響應式（桌面 / 平板 / 手機抽屜菜單）
- [ ] 分類列表頁（篩選、排序）
- [ ] 商品詳情頁（圖冊、規格、相關商品）
- [ ] GitHub Pages 部署
