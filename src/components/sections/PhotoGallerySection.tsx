import { memo, useMemo } from 'react'
import { OptimizedImage } from '@/components/shared/OptimizedMedia'
import { Reveal } from '@/components/shared/Reveal'
import { SectionBlock } from '@/components/shared/SectionBlock'
import type { GalleryPhoto } from '@/types/wedding'

interface PhotoGallerySectionProps {
  photos: GalleryPhoto[]
}

const PhotoGallerySectionBase = ({ photos }: PhotoGallerySectionProps) => {
  const photoCards = useMemo(
    () =>
      photos.map((photo, index) => {
        const orientation = photo.orientation ?? 'landscape'

        return (
          <Reveal
            key={photo.id}
            className={`photo-card photo-card--${orientation}`}
            delay={index * 0.08}
            y={22}
          >
            <figure className="photo-frame">
              <OptimizedImage
                className="photo-frame__image"
                src={photo.src}
                alt={photo.alt}
              />
              <figcaption className="photo-frame__caption">
                {photo.caption ?? 'Замените на ваше фото'}
              </figcaption>
            </figure>
          </Reveal>
        )
      }),
    [photos],
  )

  return (
    <SectionBlock
      id="gallery"
      subtitle="Фотографии"
      title="Моменты нашей любви"
      className="gallery-section"
    >
      <div className="photo-grid" role="list">
        {photoCards}
      </div>
    </SectionBlock>
  )
}

export const PhotoGallerySection = memo(PhotoGallerySectionBase)

PhotoGallerySection.displayName = 'PhotoGallerySection'
