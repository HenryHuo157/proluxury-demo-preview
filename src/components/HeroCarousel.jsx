import { useEffect, useRef, useState } from 'react'
import { IconChevronLeft, IconChevronRight } from './Icons.jsx'

const AUTOPLAY_MS = 5500

// 首頁宣傳橫幅 — 圖片 banner-*.jpg；開頭影片 video.mp4（靜音自動播放，播完才切下一張）
const VIDEO_URL = Object.values(
  import.meta.glob('../images/*.mp4', { eager: true, import: 'default' })
)[0]
const BANNERS = Object.values(
  import.meta.glob('../images/banner-*.jpg', { eager: true, import: 'default' })
).sort((a, b) => a.localeCompare(b))

const SLIDE_COUNT = BANNERS.length + 1

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)
  const videoRef = useRef(null)
  const bgVideoRef = useRef(null)

  useEffect(() => {
    if (paused || SLIDE_COUNT < 2) return undefined
    timer.current = setInterval(() => {
      setIndex((i) => {
        // 影片未播完不切換（播完由 onEnded 接手）
        if (i === 0 && videoRef.current && !videoRef.current.ended) return i
        return (i + 1) % SLIDE_COUNT
      })
    }, AUTOPLAY_MS)
    return () => clearInterval(timer.current)
  }, [paused])

  // 離開影片頁時暫停並回帶，回到影片頁從頭播放（背景模糊層同步）
  useEffect(() => {
    const v = videoRef.current
    const bg = bgVideoRef.current
    if (!v) return
    if (index === 0) {
      v.currentTime = 0
      v.play().catch(() => {})
      if (bg) {
        bg.currentTime = 0
        bg.play().catch(() => {})
      }
    } else {
      v.pause()
      if (bg) bg.pause()
    }
  }, [index])

  // 背景模糊層與前景影片保持同步（漂移大於 0.4 秒時校正）
  const syncBg = () => {
    const v = videoRef.current
    const bg = bgVideoRef.current
    if (v && bg && Math.abs(v.currentTime - bg.currentTime) > 0.4) {
      bg.currentTime = v.currentTime
    }
  }

  const go = (i) => setIndex((i + SLIDE_COUNT) % SLIDE_COUNT)

  const onVideoEnded = () => setIndex(1 % SLIDE_COUNT)

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Promotions"
    >
      <div
        className={`hero-slide video-slide ${index === 0 ? 'active' : ''}`}
        aria-hidden={index !== 0}
      >
        <video
          ref={bgVideoRef}
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="hero-video-bg"
        />
        <video
          ref={videoRef}
          src={VIDEO_URL}
          autoPlay
          muted
          loop={false}
          playsInline
          onEnded={onVideoEnded}
          onTimeUpdate={syncBg}
          aria-label="Brand video"
          className="hero-video-fg"
        />
      </div>

      {BANNERS.map((src, i) => (
        <div
          key={src}
          className={`hero-slide ${i + 1 === index ? 'active' : ''}`}
          aria-hidden={i + 1 !== index}
        >
          <img
            src={src}
            alt={`Promotion ${i + 1}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      ))}

      {SLIDE_COUNT > 1 && (
        <>
          <button className="hero-arrow prev" onClick={() => go(index - 1)} aria-label="Previous">
            <IconChevronLeft />
          </button>
          <button className="hero-arrow next" onClick={() => go(index + 1)} aria-label="Next">
            <IconChevronRight />
          </button>

          <div className="hero-dots" role="tablist">
            <button
              role="tab"
              aria-selected={index === 0}
              className={index === 0 ? 'active' : ''}
              onClick={() => go(0)}
              aria-label="Slide 1"
            />
            {BANNERS.map((src, i) => (
              <button
                key={src}
                role="tab"
                aria-selected={i + 1 === index}
                className={i + 1 === index ? 'active' : ''}
                onClick={() => go(i + 1)}
                aria-label={`Slide ${i + 2}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
