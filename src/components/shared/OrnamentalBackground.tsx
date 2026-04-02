import { motion } from 'framer-motion'
import { memo, useId } from 'react'
import { useParallax } from '@/hooks/useParallax'

interface OrnamentClusterProps {
  className: string
  distance: number
  reducedMotion: boolean
}

const OrnamentClusterBase = ({
  className,
  distance,
  reducedMotion,
}: OrnamentClusterProps) => {
  const { ref, y } = useParallax<HTMLDivElement>(distance)
  const clusterId = useId().replace(/:/g, '')

  const petalGradientId = `petalGradient-${clusterId}`
  const leafGradientId = `leafGradient-${clusterId}`

  return (
    <motion.div
      ref={ref}
      className={`ornament-cluster ${className}`}
      style={reducedMotion ? undefined : { y }}
    >
      <div className="ornament-cluster__shape">
        <svg
          className="ornament-cluster__svg"
          viewBox="0 0 340 260"
          role="presentation"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={petalGradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--tone-petal-1)" />
              <stop offset="100%" stopColor="var(--tone-petal-2)" />
            </linearGradient>
            <linearGradient id={leafGradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--tone-leaf-1)" />
              <stop offset="100%" stopColor="var(--tone-leaf-2)" />
            </linearGradient>
          </defs>

          <path
            d="M44 156c34-56 80-95 138-118 7 49-9 95-44 135-29 32-63 50-104 57-3-27-1-49 10-74z"
            fill={`url(#${leafGradientId})`}
            opacity="0.8"
          />
          <path
            d="M180 18c53 19 92 53 126 111-56 4-102-12-141-45-28-24-44-51-48-84 22-4 39-1 63 18z"
            fill={`url(#${leafGradientId})`}
            opacity="0.72"
          />

          <circle cx="84" cy="76" r="44" fill={`url(#${petalGradientId})`} opacity="0.86" />
          <circle cx="136" cy="104" r="56" fill={`url(#${petalGradientId})`} opacity="0.84" />
          <circle cx="198" cy="126" r="48" fill={`url(#${petalGradientId})`} opacity="0.82" />
          <circle cx="248" cy="90" r="42" fill={`url(#${petalGradientId})`} opacity="0.86" />
          <circle cx="114" cy="54" r="18" fill={`url(#${petalGradientId})`} opacity="0.78" />
          <circle cx="222" cy="150" r="20" fill={`url(#${petalGradientId})`} opacity="0.72" />
          <circle cx="276" cy="124" r="14" fill={`url(#${petalGradientId})`} opacity="0.68" />
        </svg>
      </div>
    </motion.div>
  )
}

const OrnamentCluster = memo(OrnamentClusterBase)

OrnamentCluster.displayName = 'OrnamentCluster'

interface OrnamentalBackgroundProps {
  reducedMotion: boolean
}

const ORNAMENT_CLUSTERS = [
  { className: 'ornament-cluster--top-left', distance: 18 },
  { className: 'ornament-cluster--top-mid-left', distance: 14 },
  { className: 'ornament-cluster--top-mid-right', distance: 16 },
  { className: 'ornament-cluster--top-right', distance: 24 },
  { className: 'ornament-cluster--middle-left', distance: 12 },
  { className: 'ornament-cluster--middle-right', distance: 13 },
  { className: 'ornament-cluster--bottom-left', distance: 15 },
  { className: 'ornament-cluster--bottom-mid', distance: 12 },
  { className: 'ornament-cluster--bottom-right', distance: 20 },
] as const

const OrnamentalBackgroundBase = ({
  reducedMotion,
}: OrnamentalBackgroundProps) => {
  return (
    <div className="ornamental-background" aria-hidden="true">
      {ORNAMENT_CLUSTERS.map((cluster) => (
        <OrnamentCluster
          key={cluster.className}
          className={cluster.className}
          distance={cluster.distance}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  )
}

export const OrnamentalBackground = memo(OrnamentalBackgroundBase)

OrnamentalBackground.displayName = 'OrnamentalBackground'
