/**
 * build-data.mjs — 將「只有Proluxury SKU.csv」轉換為前端用 JSON
 * 產出:
 *   src/data/products.json   全部商品
 *   src/data/categories.json 分類樹（5 大類 16 中類）
 *   .tmp/summary.txt         選品參考摘要（不入庫）
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CSV_PATH = path.join(ROOT, '只有Proluxury SKU.csv')

/* ---------- 簡體 → 純繁 字元映射（僅覆蓋數據中出現的簡體字） ---------- */
const S2T = {
  产: '產', 严: '嚴', 并: '並', 义: '義', 乌: '烏', 乐: '樂', 习: '習',
  乱: '亂', 争: '爭', 于: '於', 亚: '亞', 产: '產', 亲: '親', 亿: '億',
  仅: '僅', 从: '從', 仑: '崙', 仓: '倉', 仪: '儀', 们: '們', 价: '價',
  众: '眾', 优: '優', 会: '會', 传: '傳', 伤: '傷', 伦: '倫', 体: '體',
  余: '餘', 佛: '彿', 你: '你', 佣: '傭', 侠: '俠', 侣: '侶', 侧: '側',
  侦: '偵', 债: '債', 值: '值', 倾: '傾', 偿: '償', 儿: '兒', 兑: '兌',
  兰: '蘭', 关: '關', 兴: '興', 具: '具', 养: '養', 兽: '獸', 内: '內',
  冈: '岡', 册: '冊', 军: '軍', 农: '農', 冲: '沖', 决: '決', 况: '況',
  净: '淨', 凉: '涼', 减: '減', 凑: '湊', 几: '幾', 凤: '鳳', 凭: '憑',
  凯: '凱', 击: '擊', 凿: '鑿', 刍: '芻', 划: '劃', 刘: '劉', 则: '則',
  刚: '剛', 创: '創', 删: '刪', 别: '別', 刭: '剄', 刹: '剎', 剧: '劇',
  劇: '劇', 劝: '勸', 办: '辦', 务: '務', 劣: '劣', 动: '動', 助: '助',
  努: '努', 劫: '劫', 励: '勵', 劲: '勁', 劳: '勞', 势: '勢', 勋: '勳',
  動: '動', 勘: '勘', 勤: '勤', 勺: '勺', 匀: '勻', 包: '包', 匆: '匆',
  医: '醫', 卖: '賣', 协: '協', 单: '單', 卜: '卜', 占: '佔', 卡: '卡',
  卫: '衛', 厂: '廠', 厅: '廳', 历: '歷', 厉: '厲', 压: '壓', 厌: '厭',
  周: '週', 咐: '咐', 咳: '咳', 咸: '鹹', 咱: '咱', 品: '品', 哄: '哄',
  器: '器', 噪: '噪', 团: '團', 园: '園', 困: '困', 围: '圍', 国: '國',
  图: '圖', 圆: '圓', 场: '場', 坏: '壞', 块: '塊', 坚: '堅', 坛: '壇',
  坝: '壩', 垃: '垃', 圾: '圾', 塊: '塊', 塔: '塔', 塞: '塞', 墙: '牆',
  壮: '壯', 声: '聲', 壳: '殼', 壶: '壺', 处: '處', 备: '備', 复: '復',
  夠: '夠', 头: '頭', 夹: '夾', 夺: '奪', 隽: '雋', 奋: '奮', 奖: '獎',
  妆: '妝', 妇: '婦', 妈: '媽', 姊: '姊', 姿: '姿', 娘: '娘', 娛: '娛',
  婴: '嬰', 媒: '媒', 嫌: '嫌', 存: '存', 孙: '孫', 学: '學', 宁: '寧',
  实: '實', 宝: '寶', 宠: '籠', 审: '審', 対: '對', 寺: '寺', 寻: '尋',
  导: '導', 寿: '壽', 将: '將', 尔: '爾', 尘: '塵', 尝: '嘗', 尧: '堯',
  层: '層', 属: '屬', 屡: '屢', 屿: '嶼', 岁: '歲', 岂: '豈', 岗: '崗',
  岛: '島', 岭: '嶺', 岳: '嶽', 峡: '峽', 崭: '嶄', 州: '州', 巩: '鞏',
  币: '幣', 帅: '帥', 师: '師', 帐: '帳', 帘: '簾', 帽: '帽', 幂: '冪',
  幻: '幻', 广: '廣', 庄: '莊', 庆: '慶', 床: '床', 库: '庫', 应: '應',
  底: '底', 度: '度', 废: '廢', 开: '開', 异: '異', 弃: '棄', 张: '張',
  弥: '彌', 弯: '彎', 弹: '彈', 强: '強', 归: '歸', 当: '當', 录: '錄',
  彻: '徹', 径: '徑', 循: '循', 微: '微', 德: '德', 心: '心', 忆: '憶',
  忧: '憂', 怀: '懷', 态: '態', 急: '急', 总: '總', 恋: '戀', 恒: '恆',
  恶: '惡', 悦: '悅', 悬: '懸', 悯: '憫', 惊: '驚', 惧: '懼', 惨: '慘',
  惯: '慣', 愁: '愁', 愉: '愉', 愈: '癒', 愿: '願', 戈: '戈', 户: '戶',
  扁: '扁', 扇: '扇', 扪: '捫', 扫: '掃', 扬: '揚', 扰: '擾', 批: '批',
  找: '找', 护: '護', 报: '報', 担: '擔', 拟: '擬', 拢: '攏', 拣: '揀',
  拥: '擁', 择: '擇', 挂: '掛', 挡: '擋', 挤: '擠', 挥: '揮', 损: '損',
  捡: '撿', 换: '換', 据: '據', 掷: '擲', 摄: '攝', 摆: '擺', 摇: '搖',
  摸: '摸', 攀: '攀', 攒: '攢', 敛: '斂', 数: '數', 斗: '鬥', 断: '斷',
  无: '無', 旧: '舊', 时: '時', 昙: '曇', 显: '顯', 晾: '晾', 智: '智',
  暂: '暫', 曝: '曝', 曲: '曲', 更: '更', 曾: '曾', 最: '最', 月: '月',
  有: '有', 服: '服', 望: '望', 朝: '朝', 期: '期', 木: '木', 未: '未',
  本: '本', 术: '術', 机: '機', 杀: '殺', 杂: '雜', 权: '權', 条: '條',
  来: '來', 杨: '楊', 极: '極', 构: '構', 枢: '樞', 柜: '櫃', 柠: '檸',
  树: '樹', 样: '樣', 档: '檔', 桥: '橋', 检: '檢', 楼: '樓', 榜: '榜',
  槽: '槽', 横: '橫', 樱: '櫻', 欢: '歡', 欧式: '歐式', 款: '款', 死: '死',
  残: '殘', 段: '段', 毁: '毀', 母: '母', 每: '每', 比: '比', 毕: '畢',
  毛: '毛', 毯: '毯', 气: '氣', 水: '水', 汇: '匯', 污: '污', 沟: '溝',
  没olen: '沒', 泛: '泛', 洁: '潔', 测: '測', 浪: '浪', 浮: '浮', 涂: '塗',
  消: '消', 涉: '涉', 润: '潤', 涨: '漲', 渗: '滲', 温: '溫', 港: '港',
  游: '遊', 溅: '濺', 滑: '滑', 滴: '滴', 滤: '濾', 漆: '漆', 漏: '漏',
  演: '演', 潜: '潛', 澡: '澡', 激: '激', 灯: '燈', 灵: '靈', 灾: '災',
  炉: '爐', 炖: '燉', 炒: '炒', 炮: '炮', 点: '點', 烂: '爛', 烦: '煩',
  烧: '燒', 热: '熱', 煲: '煲', 熏: '熏', 燃: '燃', 燥: '燥', 爆: '爆',
  爐: '爐', 片: '片', 牌: '牌', 牙: '牙', 牛: '牛', 状: '狀', 犹: '猶',
  猛: '猛', 献: '獻', 玄: '玄', 率: '率', 玉: '玉', 环: '環', 现: '現',
  玻: '玻', 班: '班', 球: '球', 理: '理', 琴: '琴', 瑙: '瑙', 环: '環',
  电: '電', 画: '畫', 疗: '療', 疯: '瘋', 疲: '疲', 症: '症', 涂: '塗',
  简: '簡', 算: '算', 类: '類', 粒: '粒', 粉: '粉', 精: '精', 糖: '糖',
  系: '系', 紧: '緊', 累: '累', 级: '級', 纪: '紀', 约: '約', 纯: '純',
  纲: '綱', 纳: '納', 纵: '縱', 纷: '紛', 纸: '紙', 纽: '鈕', 线: '線',
  练: '練', 组: '組', 细: '細', 织: '織', 终: '終', 绍: '紹', 经: '經',
  绑: '綁', 结: '結', 绕: '繞', 绘: '繪', 给: '給', 络: '絡', 绝: '絕',
  统: '統', 继: '繼', 绩: '績', 维: '維', 绵: '綿', 缇: '緹', 罐: '罐',
  网: '網', 罗: '羅', 罚: '罰', 罢: '罷', 职: '職', 联: '聯', 肉: '肉',
  背: '背', 胶: '膠', 能: '能', 脚: '腳', 脱: '脫', 腐: '腐', 膜: '膜',
  自: '自', 舒: '舒', 舌: '舌', 舍: '捨', 良: '良', 色: '色', 节: '節',
  芦: '蘆', 花: '花', 苍: '蒼', 苏: '蘇', 范: '範', 荐: '薦', 药: '藥',
  莱: '萊', 营: '營', 蒙: '蒙', 蒜: '蒜', 蓄: '蓄', 蒸: '蒸', 蓋: '蓋',
  蓝兰: '藍蘭', 虑: '慮', 虾: '蝦', 蚊: '蚊', 蚁: '蟻', 蜂: '蜂', 螺: '螺',
  补: '補', 表: '錶', 装: '裝', 裕: '裕', 裤: '褲', 西: '西', 要: '要',
  见: '見', 观: '觀', 规: '規', 觉: '覺', 角: '角', 解: '解', 触: '觸',
  计: '計', 认: '認', 讨: '討', 让: '讓', 训: '訓', 议: '議', 记: '記',
  讲: '講', 许: '許', 论: '論', 设: '設', 访: '訪', 证: '證', 评: '評',
  识: '識', 诉: '訴', 词: '詞', 译: '譯', 试: '試', 话: '話', 询: '詢',
  该: '該', 详细: '詳細', 语: '語', 误: '誤', 说: '說', 请: '請', 诸: '諸',
  读: '讀', 课: '課', 调: '調', 谈: '談', 谋: '謀', 谐: '諧', 谱: '譜',
  贝: '貝', 负: '負', 贡: '貢', 财: '財', 责: '責', 贤: '賢',败: '敗',
  货: '貨', 质: '質', 贴: '貼', 贵: '貴', 买: '買', 费: '費', 贺: '賀',
  资: '資', 赏: '賞', 赠: '贈', 赛: '賽', 赞: '讚', 赠: '贈', 赢: '贏',
  赶: '趕', 趋: '趨', 跃: '躍', 距: '距', 路: '路', 踏: '踏', 身: '身',
  车: '車', 轨: '軌', 轮: '輪', 软: '軟', 轻: '輕', 载: '載', 较: '較',
  辅: '輔', 辆: '輛', 输: '輸', 边: '邊', 达: '達', 迁: '遷', 过: '過',
  运: '運', 还: '還', 这: '這', 进: '進', 远: '遠', 违: '違', 连: '連',
  迟: '遲', 适: '適', 选: '選', 逐: '逐', 递: '遞', 途: '途', 通: '通',
  速: '速', 造: '造', 遇: '遇', 遍: '遍', 過: '過', 道: '道', 遗: '遺',
  遥: '遙', 選: '選', 邓阳: '鄧陽', 邮: '郵', 邻: '鄰', 酬: '酬', 酸: '酸',
  醉: '醉', 采: '採', 里: '裡', 钊鉴: '釗鑒', 针: '針', 钓: '釣', 钟: '鐘',
  钢: '鋼', 钦: '欽', 钮: '鈕', 钱: '錢', 钻: '鑽', 铁: '鐵', 铃: '鈴',
  铜: '銅', 铝: '鋁', 铺: '鋪', 链: '鏈', 锅: '鍋', 锈: '鏽', 锐: '銳',
  错: '錯', 键: '鍵', 锅: '鍋', 错: '錯', 长: '長', 门: '門', 闪: '閃',
  问: '問', 间: '間', 闷: '悶', 闹: '鬧', 闻: '聞', 阅: '閱', 队: '隊',
  阳阴: '陽陰', 阶: '階', 附: '附', 际: '際', 陆: '陸', 陈: '陳', 险: '險',
  随: '隨', 隐: '隱', 难: '難', 雏: '雛', 雾: '霧', 韵: '韻', 页: '頁',
  顶: '頂', 项: '項', 顺: '順', 须: '須', 顾: '顧', 顿: '頓', 颁: '頒',
  颂: '頌', 预: '預', 领: '領', 频: '頻', 题: '題', 颜: '顏', 风: '風',
  飞: '飛', 食: '食', 餐: '餐', 饮: '飲', 饰: '飾', 馆: '館', 马: '馬',
  驱: '驅', 验: '驗', 骨: '骨', 高: '高', 鱼: '魚', 鸟: '鳥', 鸡: '雞',
  鸣: '鳴', 的: '的', 黑: '黑', 默: '默', 鼓: '鼓', 齐备: '齊備', 龙头: '龍頭',
}
const s2t = (s) => (s ? String(s).replace(/[\u4e00-\u9fff]/g, (ch) => S2T[ch] ?? ch) : s)

/* ---------- 分類樹定義（大類前綴 + 中類代號 → 雙語名） ---------- */
const GROUPS = [
  {
    code: 'EA', nameZh: '廚房電器', nameEn: 'Kitchen Appliances',
    subs: {
      EA01: { nameZh: '電飯鍋', nameEn: 'Rice Cookers' },
      EA02: { nameZh: '多用途電鍋', nameEn: 'Multi-Cookers' },
      EA03: { nameZh: '特式電廚具', nameEn: 'Specialty Cookware' },
      EA04: { nameZh: '電熱水器皿', nameEn: 'Kettles & Water Heaters' },
      EA05: { nameZh: '食物處理器', nameEn: 'Food Processors' },
      EA06: { nameZh: '電爐具及其他', nameEn: 'Hobs & Cookers' },
    },
  },
  {
    code: 'EB', nameZh: '家居電器', nameEn: 'Home Appliances',
    subs: {
      EB01: { nameZh: '清潔用品', nameEn: 'Cleaning' },
      EB02: { nameZh: '空氣調節', nameEn: 'Air Care' },
      EB03: { nameZh: '衣服護理', nameEn: 'Garment Care' },
      EB04: { nameZh: '拖把', nameEn: 'Mops' },
      EB05: { nameZh: '滅蚊蟲器', nameEn: 'Insect Killers' },
    },
  },
  {
    code: 'EC', nameZh: '個人護理', nameEn: 'Personal Care',
    subs: {
      EC01: { nameZh: '健康管理', nameEn: 'Wellness' },
      EC02: { nameZh: '美髮美容', nameEn: 'Hair & Beauty' },
    },
  },
  {
    code: 'ED', nameZh: '季節產品', nameEn: 'Seasonal',
    subs: {
      ED01: { nameZh: '夏季產品', nameEn: 'Summer Collection' },
      ED02: { nameZh: '冬季產品', nameEn: 'Winter Collection' },
    },
  },
  {
    code: 'HB', nameZh: '家品用具', nameEn: 'Home Essentials',
    subs: {
      HB41: { nameZh: '廚房小工具', nameEn: 'Kitchen Tools' },
    },
  },
]

/* ---------- CSV 解析（支援引號內換行、逗號） ---------- */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c === '\r') { /* skip */ }
    else field += c
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows
}

const cleanText = (s) =>
  (s || '')
    .replace(/\s*\n\s*/g, ' ')        // 名稱內的換行摺成空格
    .replace(/^["\s]+|["\s]+$/g, '')
    .replace(/^[*!]+/, '')            // 去掉名稱開頭的 ** / ! 標記
    .replace(/[ \t]+/g, ' ')
    .trim()

const fixBrand = (s) => (s || '').replace(/普樂氐/g, '普樂氏')

const fixImageUrl = (u) =>
  u.trim().replace(/\\/g, '/').replace(/ /g, '%20')

/* ---------- 主流程 ---------- */
const raw = fs.readFileSync(CSV_PATH, 'utf8').replace(/^\uFEFF/, '')
const table = parseCsv(raw)
const header = table[0]
const idx = Object.fromEntries(header.map((h, i) => [h, i]))

const col = {
  seq: idx['項次'], catCode: idx['中類代號'], catName: idx['中類名稱'],
  sku: idx['貨品代號'], nameZh: idx['名稱'], nameEn: idx['英文名稱'],
  descZh: idx['產品簡介'], descEn: idx['Product Description'],
  c1: idx['條件1'], c2: idx['條件2'], c3: idx['條件3'],
  c4: idx['條件4'], c5: idx['條件5'], c6: idx['條件6'],
  listedAt: idx['分類時間'], spec: idx['貨品規格'],
  imgCount: idx['圖片數量'], imgPaths: idx['圖片絕對路徑（每行一個）'],
}

const products = []
for (const r of table.slice(1)) {
  if (!r || !r[col.sku]) continue
  const images = (r[col.imgPaths] || '')
    .split(/\r?\n/).map(fixImageUrl).filter((u) => /^https?:\/\//.test(u))
  const attrs = [r[col.c1], r[col.c2], r[col.c3], r[col.c4], r[col.c5], r[col.c6]]
    .filter(Boolean).map((s) => {
      const i = s.indexOf(':')
      if (i < 0) return null
      const k = s2t(s.slice(0, i).trim())
      const v = s2t(s.slice(i + 1).trim())
      return k && v ? { k, v } : null
    })
    .filter(Boolean)
    .filter((a) => a.k !== '品牌')
  products.push({
    sku: r[col.sku].trim(),
    catCode: r[col.catCode]?.trim() || '',
    catNameZh: r[col.catName]?.trim() || '',
    nameZh: fixBrand(cleanText(r[col.nameZh])),
    nameEn: cleanText(r[col.nameEn]),
    descZh: fixBrand((r[col.descZh] || '').trim()),
    descEn: (r[col.descEn] || '').trim(),
    attrs,
    specs: (r[col.spec] || '').split('|').map((s) => fixBrand(s.trim())).filter(Boolean),
    listedAt: r[col.listedAt]?.trim() || '',
    images: [...new Set(images)],
  })
}
products.sort((a, b) => a.sku.localeCompare(b.sku))

/* ---------- 圖片可用性驗證 ----------
   只檢查每個商品前 4 張，找出第一張可載入的（filedn 有部分 404）
   --skip-check 可跳過（沿用全部 images[0]） */
const skipCheck = process.argv.includes('--skip-check')

async function checkUrl(u) {
  try {
    let r = await fetch(u, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12000) })
    if (r.ok) return true
    if (r.status === 405 || r.status === 403) {
      r = await fetch(u, { headers: { Range: 'bytes=0-0' }, redirect: 'follow', signal: AbortSignal.timeout(12000) })
      return r.ok
    }
    return false
  } catch {
    return false
  }
}

async function verifyImages() {
  const queue = [...products]
  const CONCURRENCY = 12
  let done = 0
  async function worker() {
    while (queue.length) {
      const p = queue.shift()
      let idx = -1
      for (let i = 0; i < Math.min(3, p.images.length); i++) {
        if (await checkUrl(p.images[i])) { idx = i; break }
      }
      p.imgIdx = idx
      done++
      if (done % 40 === 0) console.log(`  verified ${done}/${products.length}`)
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
}

if (skipCheck) {
  for (const p of products) p.imgIdx = p.images.length ? 0 : -1
  console.log('image check skipped (--skip-check)')
} else {
  console.log('verifying first images (this takes ~30-60s) …')
  await verifyImages()
}
const usable = products.filter((p) => p.imgIdx >= 0).length
console.log(`products with usable image: ${usable}/${products.length}`)

/* 分類樹 + 統計 */
const categories = GROUPS.map((g) => ({
  code: g.code,
  nameZh: g.nameZh,
  nameEn: g.nameEn,
  subs: Object.entries(g.subs).map(([code, n]) => ({
    code,
    nameZh: n.nameZh,
    nameEn: n.nameEn,
    count: products.filter((p) => p.catCode === code).length,
  })),
})).filter((g) => g.subs.some((s) => s.count > 0))

const outDir = path.join(ROOT, 'src', 'data')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'products.json'), JSON.stringify(products, null, 1))
fs.writeFileSync(
  path.join(outDir, 'categories.json'),
  JSON.stringify({ groups: categories, total: products.length }, null, 1)
)

/* ---------- 選品摘要（內部參考） ---------- */
const withImg = products.filter((p) => p.imgIdx >= 0)
const lines = []
lines.push(`total=${products.length} usableImage=${withImg.length} noUsableImage=${products.length - withImg.length}`)
lines.push('')
for (const g of categories) {
  lines.push(`## ${g.code} ${g.nameZh} / ${g.nameEn}`)
  for (const s of g.subs) {
    lines.push(`  -- ${s.code} ${s.nameZh} / ${s.nameEn} (${s.count})`)
    const picks = withImg.filter((p) => p.catCode === s.code).slice(0, 5)
    for (const p of picks) {
      lines.push(`     ${p.sku} | imgIdx=${p.imgIdx} | ${p.nameZh} | img=${p.images.length}`)
      lines.push(`        img: ${p.images[p.imgIdx] || '-'}`)
    }
  }
  lines.push('')
}
fs.mkdirSync(path.join(ROOT, '.tmp'), { recursive: true })
fs.writeFileSync(path.join(ROOT, '.tmp', 'summary.txt'), lines.join('\n'))

console.log(`products: ${products.length} (with images: ${withImg.length})`)
console.log(`groups: ${categories.length}`)
console.log('written: src/data/products.json, src/data/categories.json, .tmp/summary.txt')
