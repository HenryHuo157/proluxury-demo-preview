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

/** 基本富文本：先轉義 HTML，再支援 **粗體**、### 標題、- 列表與換行 */
function renderRich(raw) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const inline = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  const out = []
  let inList = false
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
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
    const h = t.match(/^#{1,6}\s+(.*)$/)
    if (h) {
      out.push('<strong class="vh">' + inline(h[1]) + '</strong>')
      continue
    }
    out.push('<p>' + inline(t) + '</p>')
  }
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

  // 新訊息時自動捲到底部
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
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

  async function send(text) {
    const msg = (text ?? input).trim()
    if (!msg || busy) return
    if (!sessionRef.current) sessionRef.current = getSessionId()
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: msg }])
    setBusy(true)
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, sessionId: sessionRef.current }),
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json().catch(() => null)
      let out = ''
      if (data && typeof data.output === 'string') out = data.output
      else if (data && Array.isArray(data.output)) out = data.output.map((o) => o?.text ?? '').join('')
      if (!out) throw new Error('empty output')
      setMessages((m) => [...m, { role: 'bot', text: out }])
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: t.victorError, error: true }])
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
            <div key={i} className={`victor-msg ${m.role === 'user' ? 'user' : 'bot'}`}>
              <div
                className="victor-bubble"
                dangerouslySetInnerHTML={{ __html: renderRich(m.text) }}
              />
            </div>
          ))}
          {busy && (
            <div className="victor-msg bot">
              <div className="victor-bubble victor-typing" aria-label={t.victorThinking}>
                <i /><i /><i />
              </div>
            </div>
          )}
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
