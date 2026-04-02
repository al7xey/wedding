import { useScroll, useTransform, type MotionValue } from 'framer-motion'

interface ParallaxResult {
  y: MotionValue<number>
}

export const useParallax = (distance = 24): ParallaxResult => {
  const { scrollYProgress } = useScroll()

  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance])

  return { y }
}
