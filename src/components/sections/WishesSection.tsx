import { memo, useMemo } from 'react'
import { Reveal } from '@/components/shared/Reveal'
import { SectionBlock } from '@/components/shared/SectionBlock'
import type { WishesContent } from '@/types/wedding'

interface WishesSectionProps {
  wishes: WishesContent
}

const WishesSectionBase = ({ wishes }: WishesSectionProps) => {
  const wishItems = useMemo(
    () =>
      wishes.items.map((item, index) => (
        <li key={`${index}-${item}`} className="wishes-list__item">
          {item}
        </li>
      )),
    [wishes.items],
  )

  return (
    <SectionBlock id="wishes" subtitle="Пожелания" title={wishes.title}>
      <Reveal className="soft-card" y={24}>
        <ul className="wishes-list">{wishItems}</ul>
      </Reveal>
    </SectionBlock>
  )
}

export const WishesSection = memo(WishesSectionBase)

WishesSection.displayName = 'WishesSection'
