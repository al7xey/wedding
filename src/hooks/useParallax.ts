import { useRef } from 'react'
import type { RefObject } from 'react'
import { useScroll, useTransform, type MotionValue } from 'framer-motion'

interface ParallaxResult<T extends HTMLElement> {
  ref: RefObject<T | null>
  y: MotionValue<number>
}

export const useParallax = <T extends HTMLElement = HTMLDivElement>(
  distance = 24,
): ParallaxResult<T> => {
  const ref = useRef<T>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance])

  return { ref, y }
}
