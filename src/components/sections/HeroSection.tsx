import { memo } from 'react'
import { Container } from '@/components/shared/Container'
import { Reveal } from '@/components/shared/Reveal'
import type { WeddingContent } from '@/types/wedding'

interface HeroSectionProps {
  content: WeddingContent
}

const HeroSectionBase = ({ content }: HeroSectionProps) => {
  return (
    <section id="hero" className="inv-section hero-screen">
      <Container>
        <div className="hero-screen__frame">
          <Reveal className="hero-screen__center" y={20}>
            <p className="hero-screen__eyebrow">Свадебное приглашение</p>
            <h1 className="hero-screen__title">
              <span>{content.coupleNames.first}</span>
              <span className="hero-screen__connector">
                {content.coupleNames.connector}
              </span>
              <span>{content.coupleNames.second}</span>
            </h1>
            <p className="hero-screen__date">{content.weddingDate}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

export const HeroSection = memo(HeroSectionBase)

HeroSection.displayName = 'HeroSection'
