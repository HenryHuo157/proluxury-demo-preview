import { useEffect, useState } from 'react'

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '')
  const [path] = raw.split('?')
  return path.split('/').filter(Boolean)
}

/** 簡易 hash 路由：回傳路徑段落陣列（如 '#/product/PAF503060' → ['product','PAF503060']） */
export function useRoute() {
  const [parts, setParts] = useState(parseHash)
  useEffect(() => {
    const onChange = () => {
      setParts(parseHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return parts
}

export const href = (to) => `#${to}`
