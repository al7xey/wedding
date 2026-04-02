import { useEffect } from 'react'
import { debounce, throttle } from '@/utils/performance'

const SCROLL_THROTTLE_MS = 80
const RESIZE_DEBOUNCE_MS = 140

export const useViewportCssVars = (): void => {
  useEffect(() => {
    const root = document.documentElement

    const updateViewportVars = () => {
      root.style.setProperty('--viewport-width', `${window.innerWidth}px`)
      root.style.setProperty('--viewport-height', `${window.innerHeight}px`)
    }

    const updateScrollProgress = () => {
      const scrollRange =
        document.documentElement.scrollHeight - window.innerHeight

      const progress =
        scrollRange > 0 ? Math.min(window.scrollY / scrollRange, 1) : 0

      root.style.setProperty('--scroll-progress', progress.toFixed(4))
    }

    const onScroll = throttle(() => {
      updateScrollProgress()
    }, SCROLL_THROTTLE_MS)

    const onResize = debounce(() => {
      updateViewportVars()
      updateScrollProgress()
    }, RESIZE_DEBOUNCE_MS)

    updateViewportVars()
    updateScrollProgress()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)

      onScroll.cancel()
      onResize.cancel()
    }
  }, [])
}
