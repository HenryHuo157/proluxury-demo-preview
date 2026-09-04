// 產生「Proluxury 夏季產品目錄」單一 HTML buyer book（B2B 用，不含價格/MOQ）
// 用法: node scripts/build-buyer-book.mjs
// 資料源: 只有Proluxury SKU.csv（中類代號 = ED01 夏季產品）
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const csvPath = join(root, '只有Proluxury SKU.csv');
const outPath = join(root, 'Proluxury 夏季產品目錄.html');

// ---------- RFC4180 CSV parser（處理引號內的逗號/換行） ----------
function parseCSV(t) {
  const rows = [];
  let row = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"') {
        if (t[i + 1] === '"') { f += '"'; i++; }
        else q = false;
      } else f += c;
    } else {
      if (c === '"') q = true;
      else if (c === ',') { row.push(f); f = ''; }
      else if (c === '\n') { row.push(f); f = ''; rows.push(row); row = []; }
      else if (c !== '\r') f += c;
    }
  }
  if (f.length || row.length) { row.push(f); rows.push(row); }
  return rows;
}

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// 圖片 URL 清洗：反斜線轉正斜線、空格轉 %20
const cleanUrl = (u) => u.trim().replace(/\\/g, '/').replace(/ /g, '%20');

// ---------- 讀取 + 篩選 ----------
const text = readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
const rows = parseCSV(text);
const head = rows[0];
const ix = Object.fromEntries(head.map((n, i) => [n, i]));
const need = ['貨品代號', '名稱', '產品簡介', '貨品規格', '中類代號',
  '條件1', '條件2', '條件3', '條件4', '條件5', '條件6',
  '圖片絕對路徑（每行一個）'];
for (const n of need) if (!(n in ix)) throw new Error('CSV 缺少欄位: ' + n);

const products = rows.slice(1)
  .filter(r => r[ix['中類代號']] === 'ED01' && r[ix['貨品代號']]?.trim());

// ---------- 清洗 + 分組 ----------
const groups = new Map(); // 類型名 -> { name, items }
for (const r of products) {
  const sku = r[ix['貨品代號']].trim();
  const name = r[ix['名稱']].replace(/^\*+\s*/, '').trim();
  const desc = (r[ix['產品簡介']] || '').trim();
  const specs = (r[ix['貨品規格']] || '').split('|').map(s => s.trim()).filter(Boolean);
  const typeRaw = ['條件1', '條件2', '條件3', '條件4', '條件5', '條件6']
    .map(k => r[ix[k]] || '')
    .find(v => /^产品類型:|^产品类型:|^產品類型:/.test(v.trim())) || '';
  const type = typeRaw.replace(/^产品類型:|^产品类型:|^產品類型:/, '').trim() || '其他';
  // 屬性 chips：排除品牌（頁首已示）及產品類型（分組已示），剔除「不適用」值
  const attrs = ['條件1', '條件2', '條件3', '條件4', '條件5', '條件6']
    .map(k => (r[ix[k]] || '').trim())
    .filter(v => v && !/^品牌:/.test(v) && !/^产品類型:|^产品类型:|^產品類型:/.test(v))
    .map(v => {
      const c = v.indexOf(':');
      return c > -1 ? { k: v.slice(0, c).trim(), v: v.slice(c + 1).trim() } : { k: '', v };
    })
    .filter(a => a.v && a.v !== '不適用');
  const imgs = (r[ix['圖片絕對路徑（每行一個）']] || '').split(/\r?\n/).map(cleanUrl).filter(Boolean);
  if (!groups.has(type)) groups.set(type, { name: type, items: [] });
  groups.get(type).items.push({ sku, name, desc, specs, attrs, img: imgs[0] || '' });
}

const groupList = [...groups.values()].sort((a, b) => b.items.length - a.items.length);
const noImg = products.filter(r => !(r[ix['圖片絕對路徑（每行一個）']] || '').trim()).length;
const noDesc = products.filter(r => !(r[ix['產品簡介']] || '').trim()).length;

// ---------- 產生 HTML ----------
const cardsHtml = (items) => items.map(p => `
      <article class="card">
        ${p.img
          ? `<div class="thumb"><img loading="lazy" src="${esc(p.img)}" alt="${esc(p.name)}"></div>`
          : `<div class="thumb empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m5 18 5-5 3.5 3.5L17 13l4 5"/></svg><span>暫無圖片</span></div>`}
        <div class="body">
          <div class="sku">${esc(p.sku)}</div>
          <h3 class="name">${esc(p.name)}</h3>
          ${p.desc ? `<p class="desc">${esc(p.desc)}</p>` : ''}
          ${(p.specs.length || p.attrs.length) ? `<div class="chips">${[
            ...p.specs.map(s => `<span class="chip spec">${esc(s)}</span>`),
            ...p.attrs.map(a => `<span class="chip">${esc(a.k ? a.k + '：' + a.v : a.v)}</span>`)
          ].join('')}</div>` : ''}
        </div>
      </article>`).join('\n');

const navHtml = groupList.map((g, i) =>
  `<a href="#g${i}">${esc(g.name)}<b>${g.items.length}</b></a>`).join('\n      ');

const sectionsHtml = groupList.map((g, i) => `
    <section id="g${i}">
      <h2>${esc(g.name)}<span>${g.items.length} 款</span></h2>
      <div class="grid">${cardsHtml(g.items)}
      </div>
    </section>`).join('\n');

const html = `<!DOCTYPE html>
<html lang="zh-HK">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Proluxury 普樂氏 · 夏季產品目錄</title>
<style>
  :root {
    --navy: #0e2a47; --navy-deep: #0b2138; --coral: #ff8f95;
    --ink: #1f2937; --muted: #6b7280; --line: #e5e7eb; --bg: #f6f7f9;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", "Microsoft JhengHei",
      "Noto Sans TC", "Heiti TC", sans-serif;
    background: var(--bg); color: var(--ink); line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 1240px; margin: 0 auto; padding: 0 20px; }

  /* ---- 頁首 ---- */
  .hero { background: linear-gradient(135deg, var(--navy) 0%, var(--navy-deep) 100%); color: #fff; }
  .hero .wrap { padding: 52px 20px 44px; }
  .brand { font-size: 14px; letter-spacing: .35em; color: var(--coral); font-weight: 700; }
  .brand span { color: #fff; margin-left: 10px; letter-spacing: .2em; font-weight: 400; }
  .hero h1 { font-size: clamp(30px, 5.4vw, 46px); font-weight: 800; margin-top: 18px; letter-spacing: .06em; }
  .hero h1::after { content: ""; display: block; width: 56px; height: 4px; background: var(--coral); border-radius: 2px; margin-top: 16px; }
  .hero .sub { margin-top: 14px; font-size: 15px; color: #c9d4e0; }
  .hero .note { margin-top: 22px; display: inline-block; font-size: 13px; color: #ffd7d9;
    border: 1px solid rgba(255,143,149,.45); border-radius: 999px; padding: 5px 14px; }

  /* ---- 分類導航 ---- */
  .toc { position: sticky; top: 0; z-index: 10; background: #fff; border-bottom: 1px solid var(--line);
    box-shadow: 0 1px 6px rgba(14,42,71,.06); }
  .toc .chips { display: flex; gap: 8px; overflow-x: auto; padding: 10px 20px; scrollbar-width: none; }
  .toc .chips::-webkit-scrollbar { display: none; }
  .toc a { flex: 0 0 auto; font-size: 13px; color: var(--navy); text-decoration: none;
    border: 1px solid var(--line); border-radius: 999px; padding: 5px 13px; white-space: nowrap;
    transition: background .15s, color .15s, border-color .15s; }
  .toc a b { font-weight: 700; color: var(--coral); margin-left: 5px; }
  .toc a:hover, .toc a.on { background: var(--navy); color: #fff; border-color: var(--navy); }
  .toc a:hover b, .toc a.on b { color: var(--coral); }

  /* ---- 分組 ---- */
  main { padding: 30px 0 10px; }
  section { scroll-margin-top: 66px; padding-bottom: 26px; }
  section h2 { font-size: 21px; color: var(--navy); display: flex; align-items: baseline; gap: 10px;
    margin: 14px 0 16px; padding-left: 12px; border-left: 4px solid var(--coral); line-height: 1.3; }
  section h2 span { font-size: 13px; color: var(--muted); font-weight: 400; }

  /* ---- 產品卡 ---- */
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 18px; }
  .card { background: #fff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden;
    display: flex; flex-direction: column; transition: box-shadow .18s, transform .18s; }
  .card:hover { box-shadow: 0 8px 22px rgba(14,42,71,.12); transform: translateY(-2px); }
  .thumb { aspect-ratio: 1/1; background: #fff; border-bottom: 1px solid var(--line);
    display: flex; align-items: center; justify-content: center; }
  .thumb img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
  .thumb.empty { background: var(--bg); color: #9aa4b0; flex-direction: column; gap: 8px; font-size: 13px; }
  .thumb.empty svg { width: 44px; height: 44px; }
  .body { padding: 14px 15px 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
  .sku { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12px; color: var(--muted); letter-spacing: .03em; }
  .name { font-size: 15.5px; font-weight: 700; color: var(--navy); line-height: 1.45; }
  .desc { font-size: 13.5px; color: #4b5563; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; white-space: pre-line; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; padding-top: 4px; }
  .chip { font-size: 12px; background: var(--bg); border: 1px solid var(--line); color: #4b5563;
    border-radius: 999px; padding: 2px 9px; line-height: 1.5; }
  .chip.spec { background: #fff; border-color: #d8dee6; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11.5px; }

  /* ---- 頁尾 ---- */
  footer { background: var(--navy-deep); color: #c9d4e0; margin-top: 30px; }
  footer .wrap { padding: 30px 20px; text-align: center; font-size: 13px; }
  footer .brand { letter-spacing: .3em; margin-bottom: 10px; display: block; }
  footer p { margin-top: 4px; }

  /* ---- 回頂 ---- */
  #top-btn { position: fixed; right: 18px; bottom: 18px; width: 42px; height: 42px; border-radius: 50%;
    border: none; background: var(--navy); color: #fff; font-size: 18px; cursor: pointer;
    box-shadow: 0 4px 14px rgba(14,42,71,.35); opacity: 0; pointer-events: none; transition: opacity .2s; z-index: 20; }
  #top-btn.show { opacity: 1; pointer-events: auto; }

  /* ---- 手機 ---- */
  @media (max-width: 560px) {
    .grid { grid-template-columns: 1fr 1fr; gap: 12px; }
    .thumb img { padding: 6px; }
    .body { padding: 10px 11px 12px; }
    .name { font-size: 14px; }
    .desc { font-size: 12.5px; -webkit-line-clamp: 3; }
    .chip { font-size: 11px; padding: 2px 7px; }
    .hero .wrap { padding: 38px 20px 34px; }
    section h2 { font-size: 18px; }
  }
  @media (max-width: 400px) {
    .grid { grid-template-columns: 1fr; }
  }

  /* ---- 列印 ---- */
  @media print {
    .toc, #top-btn { display: none; }
    body { background: #fff; }
    .hero { background: var(--navy) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .hero .wrap { padding: 26px 0 20px; }
    .grid { grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { break-inside: avoid; box-shadow: none; }
    section { padding-bottom: 8px; }
    section h2 { break-after: avoid; }
  }
</style>
</head>
<body>

<header class="hero">
  <div class="wrap">
    <div class="brand">PROLUXURY<span>普樂氏</span></div>
    <h1>夏季產品目錄</h1>
    <p class="sub">共 ${products.length} 款產品 · ${groupList.length} 個產品類別</p>
    <p class="note">本目錄僅供 B2B 參考 · 價格及 MOQ 請聯絡我們的銷售團隊</p>
  </div>
</header>

<nav class="toc" aria-label="產品分類">
  <div class="chips wrap">
      ${navHtml}
  </div>
</nav>

<main class="wrap">${sectionsHtml}
</main>

<footer>
  <div class="wrap">
    <span class="brand">PROLUXURY</span>
    <p>本目錄僅供 B2B 參考，產品規格如有更改，恕不另行通知。</p>
    <p>價格及最低訂購量（MOQ）請聯絡我們的銷售團隊。</p>
  </div>
</footer>

<button id="top-btn" aria-label="回到頂部">↑</button>
<script>
  const btn = document.getElementById('top-btn');
  addEventListener('scroll', () => btn.classList.toggle('show', scrollY > 500), { passive: true });
  btn.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  const links = [...document.querySelectorAll('.toc a')];
  const secs = links.map(a => document.querySelector(a.getAttribute('href')));
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
    }});
  }, { rootMargin: '-30% 0px -60% 0px' });
  secs.forEach(s => s && io.observe(s));
</script>
</body>
</html>
`;

writeFileSync(outPath, html, 'utf8');
console.log(`ED01 產品: ${products.length} 款 | 分組: ${groupList.length} 個`);
console.log('分組明細:', groupList.map(g => `${g.name}(${g.items.length})`).join('、'));
console.log(`無圖片: ${noImg} 款 | 無簡介: ${noDesc} 款`);
console.log('無圖片 SKU:', products
  .filter(r => !(r[ix['圖片絕對路徑（每行一個）']] || '').trim())
  .map(r => r[ix['貨品代號']].trim()).join(', ') || '（無）');
console.log(`已輸出: ${outPath} (${(html.length / 1024).toFixed(0)} KB)`);
