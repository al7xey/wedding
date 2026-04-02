import { memo } from 'react'
import { Reveal } from '@/components/shared/Reveal'
import { Container } from '@/components/shared/Container'
import type { FinalBlockContent } from '@/types/wedding'

interface FinalSectionProps {
  content: FinalBlockContent
}

const FinalSectionBase = ({ content }: FinalSectionProps) => {
  return (
    <section id="finale" className="inv-section final-section">
      <Container>
        <Reveal className="final-section__card" y={22}>
          <p className="final-section__eyebrow">До скорой встречи</p>
          <blockquote className="final-section__quote">{content.quote}</blockquote>
          <p className="final-section__sign">{content.sign}</p>
        </Reveal>
      </Container>
    </section>
  )
}

export const FinalSection = memo(FinalSectionBase)

FinalSection.displayName = 'FinalSection'
