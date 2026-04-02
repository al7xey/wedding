import { memo } from 'react'
import { Reveal } from '@/components/shared/Reveal'
import { SectionBlock } from '@/components/shared/SectionBlock'
import type { VenueInfo } from '@/types/wedding'

interface VenueSectionProps {
  venue: VenueInfo
}

const VenueSectionBase = ({ venue }: VenueSectionProps) => {
  return (
    <SectionBlock
      id="venue"
      subtitle="Место проведения"
      title="Локация и атмосфера"
    >
      <div className="venue-grid">
        <Reveal className="soft-card venue-card" y={24}>
          <p className="venue-card__label">Локация</p>
          <h3 className="venue-card__title">{venue.name}</h3>
          <p className="venue-card__address">{venue.address}</p>
          <p className="venue-card__placeholder">{venue.detailsPlaceholder}</p>
        </Reveal>

        <Reveal className="soft-card venue-card" delay={0.12} y={24}>
          <p className="venue-card__label">Атмосфера</p>
          <p className="venue-card__note">{venue.note}</p>
          <p className="venue-card__map-hint">{venue.mapHint}</p>
        </Reveal>
      </div>
    </SectionBlock>
  )
}

export const VenueSection = memo(VenueSectionBase)

VenueSection.displayName = 'VenueSection'
