import { memo, useId } from 'react'
import type { CSSProperties } from 'react'

type ClusterSide = 'left' | 'right'

interface OrnamentClusterProps {
  side: ClusterSide
  top: string
  horizontalOffset: string
  distance: number
  opacity: number
  driftDuration: number
  driftDelay: number
  reducedMotion: boolean
}

interface ClusterConfig {
  key: string
  side: ClusterSide
  top: string
  horizontalOffset: string
  distance: number
  opacity: number
  driftDuration: number
  driftDelay: number
}

const CLUSTER_TOPS = [
  2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52, 57, 62, 67, 72, 77, 82, 87, 92,
  97,
] as const

const ORNAMENT_CLUSTERS: ClusterConfig[] = CLUSTER_TOPS.flatMap((top, index) => {
  const distance = 8 + (index % 6)
  const opacity = 0.44 + (index % 4) * 0.07
  const offset = `-${2.2 + (index % 3) * 0.35}rem`
  const driftDuration = 9 + (index % 5) * 1.3
  const driftDelay = (index % 7) * -0.8

  return [
    {
      key: `left-${index}`,
      side: 'left',
      top: `${top}%`,
      horizontalOffset: offset,
      distance,
      opacity,
      driftDuration,
      driftDelay,
    },
    {
      key: `right-${index}`,
      side: 'right',
      top: `${top}%`,
      horizontalOffset: offset,
      distance,
      opacity,
      driftDuration,
      driftDelay,
    },
  ]
})

const OrnamentClusterBase = ({
  side,
  top,
  horizontalOffset,
  distance,
  opacity,
  driftDuration,
  driftDelay,
  reducedMotion,
}: OrnamentClusterProps) => {
  const clusterId = useId().replace(/:/g, '')

  const petalGradientId = `petalGradient-${clusterId}`
  const leafGradientId = `leafGradient-${clusterId}`

  const positionalStyle: CSSProperties & Record<string, string | number> = {
    top,
    opacity,
    '--ornament-drift-duration': `${driftDuration}s`,
    '--ornament-drift-delay': `${driftDelay}s`,
    '--ornament-drift-y': `${1.8 + (distance % 4) * 0.45}px`,
    '--ornament-drift-rotate': `${side === 'left' ? 1 : -1}deg`,
    '--ornament-parallax-distance': `${distance}px`,
    ...(side === 'left'
      ? { left: horizontalOffset }
      : { right: horizontalOffset }),
  }

  return (
    <div
      className={`ornament-cluster ornament-cluster--side-${side}${reducedMotion ? ' is-reduced-motion' : ''}`}
      style={positionalStyle}
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
    </div>
  )
}

const OrnamentCluster = memo(OrnamentClusterBase)

OrnamentCluster.displayName = 'OrnamentCluster'

interface OrnamentalBackgroundProps {
  reducedMotion: boolean
}

const OrnamentalBackgroundBase = ({
  reducedMotion,
}: OrnamentalBackgroundProps) => {
  return (
    <div className="ornamental-background" aria-hidden="true">
      {ORNAMENT_CLUSTERS.map((cluster) => (
        <OrnamentCluster
          key={cluster.key}
          side={cluster.side}
          top={cluster.top}
          horizontalOffset={cluster.horizontalOffset}
          distance={cluster.distance}
          opacity={cluster.opacity}
          driftDuration={cluster.driftDuration}
          driftDelay={cluster.driftDelay}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  )
}

export const OrnamentalBackground = memo(OrnamentalBackgroundBase)

OrnamentalBackground.displayName = 'OrnamentalBackground'
