import { memo } from 'react'
import { Reveal } from '@/components/shared/Reveal'
import { SectionBlock } from '@/components/shared/SectionBlock'

interface GreetingSectionProps {
  text: string
}

const GreetingSectionBase = ({ text }: GreetingSectionProps) => {
  return (
    <SectionBlock
      id="greeting"
      subtitle="Короткое приветствие"
      title="Мы очень ждем этот день"
    >
      <Reveal className="soft-card soft-card--greeting" y={20}>
        <p className="lead-text">{text}</p>
      </Reveal>
    </SectionBlock>
  )
}

export const GreetingSection = memo(GreetingSectionBase)

GreetingSection.displayName = 'GreetingSection'
