import { memo } from 'react'
import type {
  ImgHTMLAttributes,
  VideoHTMLAttributes,
} from 'react'

type OptimizedImageProps = ImgHTMLAttributes<HTMLImageElement>

type OptimizedVideoProps = VideoHTMLAttributes<HTMLVideoElement>

const OptimizedImageBase = ({
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  ...props
}: OptimizedImageProps) => {
  return (
    <img
      {...props}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
    />
  )
}

export const OptimizedImage = memo(OptimizedImageBase)

OptimizedImage.displayName = 'OptimizedImage'

const OptimizedVideoBase = ({
  preload = 'metadata',
  playsInline = true,
  ...props
}: OptimizedVideoProps) => {
  return (
    <video {...props} preload={preload} playsInline={playsInline} />
  )
}

export const OptimizedVideo = memo(OptimizedVideoBase)

OptimizedVideo.displayName = 'OptimizedVideo'
