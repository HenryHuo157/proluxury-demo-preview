import { useEffect, useRef, useState } from 'react'

/**
 * 數字滾動：進入視口後從 0 遞增到目標值（rAF 緩動）。
 * 非數字內容（如 "HK"）原樣顯示。
 */
export default function CountUp({ value, duration = 1400 }) {
  const match = /^\s*(\d+)(.*)$/.exec(String(value))
  const target = match ? parseInt(match[1], 10) : NaN
  const suffix = match ? match[2] : ''
  const isNumeric = Number.isFinite(target)
  const ref = useRef(null)
  const [display, setDisplay] = useState(isNumeric ? 0 : value)
  const started = useRef(false)

  useEffect(() => {
    if (!isNumeric) return undefined
    const el = ref.current
    if (!el) return undefined

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplay(target)
      return undefined
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        io.disconnect()
        const t0 = performance.now()
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
          setDisplay(Math.round(target * eased))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isNumeric, target, duration])

  return (
    <span ref={ref}>
      {isNumeric ? `${display}${suffix}` : value}
    </span>
  )
}
