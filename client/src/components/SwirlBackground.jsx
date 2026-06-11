import { useEffect, useRef, useState } from 'react'
import { initSwirlCanvas } from '../utils/swirlCanvas'

function SwirlBackground() {
  const containerRef = useRef(null)
  const [staticOnly, setStaticOnly] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      setStaticOnly(true)
      return undefined
    }

    if (!containerRef.current) return undefined

    return initSwirlCanvas(containerRef.current)
  }, [])

  if (staticOnly) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-void"
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 bg-void"
      aria-hidden="true"
    />
  )
}

export default SwirlBackground
