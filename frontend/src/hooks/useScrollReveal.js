import { useEffect, useRef } from 'react'

// Observe groups once. Content remains readable when motion or observers are unavailable.
export default function useScrollReveal() {
  const rootRef = useRef(null)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return

    const targets = root.querySelectorAll(
      '.section-heading, .process-line, .class-grid, .metrics-grid, .about-grid, .tech-grid',
    )
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })

    const updatePreference = () => {
      observer.disconnect()
      targets.forEach((target) => {
        target.classList.remove('reveal-visible')
        if (!preference.matches) observer.observe(target)
      })
    }
    updatePreference()
    preference.addEventListener('change', updatePreference)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', updatePreference)
      targets.forEach((target) => target.classList.remove('reveal-visible'))
    }
  }, [])

  return rootRef
}
