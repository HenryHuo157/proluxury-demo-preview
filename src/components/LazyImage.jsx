import { useState } from 'react'

/**
 * 懶加載圖片：filedn 直連、載入後淡入、失敗顯示佔位圖形
 */
export default function LazyImage({ src, alt = '', className = '', fit = 'contain' }) {
  const [state, setState] = useState('loading') // loading | done | error
  return (
    <div className={`lzimg ${className}`} data-state={state} data-fit={fit}>
      {src && state !== 'error' ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setState('done')}
          onError={() => setState('error')}
        />
      ) : (
        <span className="lzimg-ph" aria-hidden="true">
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="2" />
            <path d="m3 17 5-4 4 3 4-5 5 6" />
          </svg>
          <small>{alt}</small>
        </span>
      )}
    </div>
  )
}
