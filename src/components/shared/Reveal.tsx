import { motion } from 'framer-motion'
import { memo, useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface RevealProps extends PropsWithChildren {
  className?: string
  delay?: number
  y?: number
  once?: boolean
  amount?: number
}

const RevealBase = ({
  children,
  className,
  delay = 0,
  y = 32,
  once = true,
  amount = 0.3,
}: RevealProps) => {
  const reduceMotion = usePrefersReducedMotion()

  const viewport = useMemo(() => ({ once, amount }), [once, amount])

  const transition = useMemo(
    () => ({
      duration: 0.95,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    }),
    [delay],
  )

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}

export const Reveal = memo(RevealBase)

Reveal.displayName = 'Reveal'
