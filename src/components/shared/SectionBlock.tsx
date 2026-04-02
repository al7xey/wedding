import { memo, useMemo } from 'react'
import type { SectionProps } from '@/types/wedding'
import { Container } from '@/components/shared/Container'
import { Reveal } from '@/components/shared/Reveal'

const SectionBlockBase = ({
  id,
  title,
  subtitle,
  className,
  children,
}: SectionProps) => {
  const sectionClassName = useMemo(
    () => (className ? `inv-section ${className}` : 'inv-section'),
    [className],
  )

  return (
    <section id={id} className={sectionClassName}>
      <Container>
        <Reveal className="section-head">
          {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
          <h2 className="section-title">{title}</h2>
        </Reveal>
        <div className="section-body">{children}</div>
      </Container>
    </section>
  )
}

export const SectionBlock = memo(SectionBlockBase)

SectionBlock.displayName = 'SectionBlock'
