import { memo, useMemo } from 'react'
import { Reveal } from '@/components/shared/Reveal'
import { SectionBlock } from '@/components/shared/SectionBlock'
import type { StoryItem } from '@/types/wedding'

interface StorySectionProps {
  story: StoryItem[]
}

const StorySectionBase = ({ story }: StorySectionProps) => {
  const storyCards = useMemo(
    () =>
      story.map((item, index) => (
        <Reveal
          key={`${item.title}-${index}`}
          className="story-card"
          delay={index * 0.12}
          y={30}
        >
          {item.year ? <p className="story-card__year">{item.year}</p> : null}
          <h3 className="story-card__title">{item.title}</h3>
          <p className="story-card__text">{item.text}</p>
        </Reveal>
      )),
    [story],
  )

  return (
    <SectionBlock id="story" subtitle="Наша история" title="Как все начиналось">
      <div className="story-grid">{storyCards}</div>
    </SectionBlock>
  )
}

export const StorySection = memo(StorySectionBase)

StorySection.displayName = 'StorySection'
