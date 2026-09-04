import { useEffect, useRef, useState } from 'react'
import { useLang, dict } from '../i18n.jsx'

const WEBHOOK_URL = 'https://n8nweb.mainplan.work/webhook/c2e6fabd-9a2b-43c5-82f3-19c6caec52ee/chat'

/** 每個瀏覽器 session 產生一次 sessionId，讓 n8n 端的 Victor 記住對話 */
function getSessionId() {
  try {
    let id = sessionStorage.getItem('victor-session')
    if (!id) {
      id = 'victor-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
      sessionStorage.setItem('victor-session', id)
    }
    return id
  } catch {
    return 'victor-' + Date.now().toString(36)
  }
}

/** 清除 LLM 洩漏到文字流的工具呼叫標記(含串流中未關閉的區塊) */
function stripToolCalls(text) {
  let out = text.replace(/<tool_call>[\s\S]*?<\/tool_call>/g, '')
  const open = out.indexOf('<tool_call>')
  if (open !== -1) out = out.slice(0, open)
  return out.replace(/<\/?(function|parameter|tool_call)[^>]*>/g, '')
}

/** Markdown 表格轉 HTML */
function mdTableToHtml(lines, inline) {
  const rows = lines
    .map((l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
    .filter((r) => !r.every((c) => c === '' || /^:?-{2,}:?$/.test(c)))
  if (!rows.length) return ''
  const [head, ...rest] = rows
  const th = '<tr>' + head.map((c) => '<th>' + inline(c) + '</th>').join('') + '</tr>'
  const trs = rest
    .map((r) => '<tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>')
    .join('')
  return '<div class="vt-wrap"><table><thead>' + th + '</thead><tbody>' + trs + '</tbody></table></div>'
}

/** 基本富文本:先轉義 HTML,再支援 **粗體**、### 標題、- 列表、表格與換行 */
function renderRich(raw) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const inline = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  const src = stripToolCalls(raw || '')
  const out = []
  let inList = false
  let tableLines = null
  const flushTable = () => {
    if (tableLines) {
      out.push(mdTableToHtml(tableLines, inline))
      tableLines = null
    }
  }
  for (const line of src.split(/\r?\n/)) {
    const t = line.trim()
    if (t.startsWith('|')) {
      if (inList) {
        out.push('</ul>')
        inList = false
      }
      if (!tableLines) tableLines = []
      tableLines.push(t)
      continue
    }
    flushTable()
    const li = t.match(/^[-*•]\s+(.*)$/)
    const ol = t.match(/^\d+[.、)]\s+(.*)$/)
    if (li || ol) {
      if (!inList) {
        out.push('<ul>')
        inList = true
      }
      out.push('<li>' + inline(li ? li[1] : ol[1]) + '</li>')
      continue
    }
    if (inList) {
      out.push('</ul>')
      inList = false
    }
    if (!t) continue
    if (/^-{3,}$/.test(t)) {
      out.push('<hr>')
      continue
    }
    const h = t.match(/^#{1,6}\s+(.*)$/)
    if (h) {
      out.push('<strong class="vh">' + inline(h[1]) + '</strong>')
      continue
    }
    out.push('<p>' + inline(t) + '</p>')
  }
  flushTable()
  if (inList) out.push('</ul>')
  return out.join('')
}

/** AI 客服 Victor 浮動聊天視窗 — 全站顯示，風格跟隨網站設計語言 */
export default function VictorChat() {
  const { lang } = useLang()
  const t = dict[lang]
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)
  const sessionRef = useRef(null)

  // 進站片刻後彈出小提示，吸引注意
  useEffect(() => {
    const show = setTimeout(() => setTeaser(true), 2400)
    const hide = setTimeout(() => setTeaser(false), 12000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  // 首次開啟時顯示歡迎訊息
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'bot', text: t.victorWelcome }])
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // 新訊息時自動捲到底部(僅在使用者已貼近底部時,避免打斷往上回看)
  useEffect(() => {
    const el = listRef.current
    if (el) {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 90
      if (nearBottom) el.scrollTop = el.scrollHeight
    }
  }, [messages, busy, open])

  // Esc 關閉
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  /** 更新串流中的最後一則 bot 訊息 */
  const updateStreamText = (full) => {
    setMessages((m) => {
      if (!m.length || m[m.length - 1].role !== 'bot') return m
      const copy = [...m]
      copy[copy.length - 1] = { ...copy[copy.length - 1], text: full }
      return copy
    })
  }

  const finishStream = (patch) => {
    setMessages((m) => {
      if (!m.length || m[m.length - 1].role !== 'bot') return m
      const copy = [...m]
      copy[copy.length - 1] = { ...copy[copy.length - 1], streaming: false, ...patch }
      return copy
    })
  }

  async function send(text) {
    const msg = (text ?? input).trim()
    if (!msg || busy) return
    if (!sessionRef.current) sessionRef.current = getSessionId()
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: msg }, { role: 'bot', text: '', streaming: true }])
    setBusy(true)
    let acc = ''
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ message: msg, sessionId: sessionRef.current }),
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)

      // n8n 串流回應為 NDJSON:begin → keepalive* → item* → end
      if (res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() // 保留未完成的行
          for (const line of lines) {
            const s = line.trim()
            if (!s) continue
            let ev
            try {
              ev = JSON.parse(s)
            } catch {
              continue
            }
            if (ev.type === 'item' && typeof ev.content === 'string') {
              acc += ev.content
              updateStreamText(acc)
            } else if (typeof ev.output === 'string' && !ev.type) {
              // 後端若以單一 JSON 回覆(非串流),直接當成完整文字
              acc = ev.output
              updateStreamText(acc)
            }
          }
        }
      } else {
        // 舊瀏覽器無 ReadableStream:退回一次性 JSON
        const data = await res.json().catch(() => null)
        if (data && typeof data.output === 'string') {
          acc = data.output
          updateStreamText(acc)
        }
      }

      if (!stripToolCalls(acc).trim()) throw new Error('empty stream')
      finishStream({})
    } catch (err) {
      if (stripToolCalls(acc).trim()) {
        // 串流中斷但已有部分內容:保留已收到的文字
        finishStream({})
      } else {
        finishStream({ text: t.victorError, error: true })
      }
    } finally {
      setBusy(false)
    }
  }

  const showChips = messages.length <= 1 && !busy

  return (
    <div className={`victor ${open ? 'open' : ''}`}>
      {teaser && !open && (
        <button className="victor-teaser" onClick={() => setOpen(true)}>
          {t.victorTeaser}
          <span
            className="victor-teaser-x"
            role="button"
            tabIndex={-1}
            aria-label={t.close}
            onClick={(e) => {
              e.stopPropagation()
              setTeaser(false)
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </span>
        </button>
      )}

      <div className="victor-panel" role="dialog" aria-label="AI Victor" aria-hidden={!open}>
        <header className="victor-head">
          <div className="victor-avatar" aria-hidden="true">V</div>
          <div className="victor-id">
            <strong>AI VICTOR</strong>
            <span><i className="victor-dot" />{t.victorStatus}</span>
          </div>
          <button className="victor-close" onClick={() => setOpen(false)} aria-label={t.close}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="victor-body" ref={listRef}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`victor-msg ${m.role === 'user' ? 'user' : 'bot'}${m.streaming ? ' streaming' : ''}`}
            >
              {m.role === 'bot' && m.streaming && !stripToolCalls(m.text).trim() ? (
                <div className="victor-bubble victor-typing" aria-label={t.victorThinking}>
                  <i /><i /><i />
                </div>
              ) : (
                <div
                  className="victor-bubble"
                  dangerouslySetInnerHTML={{ __html: renderRich(m.text) }}
                />
              )}
            </div>
          ))}
          {showChips && (
            <div className="victor-chips">
              {t.victorQuick.map((q) => (
                <button key={q} onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}
        </div>

        <form
          className="victor-input"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder={t.victorPlaceholder}
            aria-label={t.victorPlaceholder}
            maxLength={500}
          />
          <button type="submit" disabled={busy || !input.trim()} aria-label={t.victorSend}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>

      <button
        className={`victor-fab ${teaser ? 'ping' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t.close : t.victorOpen}
        aria-expanded={open}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!open && <span className="victor-fab-badge">AI</span>}
      </button>
    </div>
  )
}
