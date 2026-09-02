import { useEffect, useState } from 'react'
import { useLang, dict } from '../i18n.jsx'
import { href } from '../router.jsx'
import { IconPhone, IconMail, IconPin, IconChevronRight } from '../components/Icons.jsx'

export default function ContactPage() {
  const { lang } = useLang()
  const t = dict[lang]
  const [sent, setSent] = useState(false)

  useEffect(() => {
    document.title = `${t.footerContactTitle} | Proluxury 普樂氏`
  }, [t.footerContactTitle])

  const channels = [
    { icon: <IconPin size={20} />, label: t.footerAddress },
    { icon: <IconPhone size={20} />, label: t.footerHotline },
    { icon: <IconMail size={20} />, label: t.footerEmail },
  ]

  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={href('/')}>{t.breadcrumbHome}</a>
          <span>/</span>
          <strong>{t.footerContactTitle}</strong>
        </nav>

        <header className="page-head">
          <span className="kicker">{t.contactKicker}</span>
          <h1>{t.footerContactTitle}</h1>
          <p>{t.contactLead}</p>
        </header>

        <div className="contact-grid">
          <div className="contact-channels">
            {channels.map((c) => (
              <div className="contact-channel" key={c.label}>
                <span className="contact-channel-icon">{c.icon}</span>
                <span>{c.label}</span>
              </div>
            ))}
            <p className="muted">{t.footerHours}</p>
          </div>

          <form className="contact-form" onSubmit={onSubmit}>
            {sent ? (
              <p className="contact-sent">
                {lang === 'zh'
                  ? '已收到你的查詢，我們會盡快回覆，謝謝！'
                  : 'Thank you — we have received your enquiry and will reply soon.'}
              </p>
            ) : (
              <>
                <label>
                  {lang === 'zh' ? '姓名' : 'Name'}
                  <input required type="text" name="name" />
                </label>
                <label>
                  {lang === 'zh' ? '電郵' : 'Email'}
                  <input required type="email" name="email" />
                </label>
                <label>
                  {lang === 'zh' ? '查詢內容' : 'Message'}
                  <textarea required name="message" rows={5} />
                </label>
                <button className="btn" type="submit">
                  {lang === 'zh' ? '送出查詢' : 'Send Enquiry'}
                  <IconChevronRight size={15} />
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
