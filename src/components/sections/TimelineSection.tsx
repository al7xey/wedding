import { memo, useMemo } from 'react'
import { Reveal } from '@/components/shared/Reveal'
import { SectionBlock } from '@/components/shared/SectionBlock'
import type { TimelineItem } from '@/types/wedding'

interface TimelineSectionProps {
  items: TimelineItem[]
}

const TimelineSectionBase = ({ items }: TimelineSectionProps) => {
  const timelineItems = useMemo(
    () =>
      items.map((item, index) => (
        <Reveal
          key={`${item.time}-${item.title}`}
          className="timeline-item"
          delay={index * 0.09}
          y={26}
        >
          <div className="timeline-item__time">{item.time}</div>
          <div className="timeline-item__content">
            <h3 className="timeline-item__title">{item.title}</h3>
            <p className="timeline-item__description">{item.description}</p>
          </div>
        </Reveal>
      )),
    [items],
  )

  return (
    <SectionBlock id="timeline" subtitle="Таймлайн дня" title="План праздника">
      <div className="timeline-list" role="list">
        {timelineItems}
      </div>
    </SectionBlock>
  )
}

export const TimelineSection = memo(TimelineSectionBase)

TimelineSection.displayName = 'TimelineSection'
