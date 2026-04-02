import { memo, useMemo } from 'react'
import { Reveal } from '@/components/shared/Reveal'
import { SectionBlock } from '@/components/shared/SectionBlock'
import type { WeddingContent } from '@/types/wedding'

interface DressCodeSectionProps {
  dressCode: WeddingContent['dressCode']
}

const DressCodeSectionBase = ({
  dressCode,
}: DressCodeSectionProps) => {
  const paletteItems = useMemo(
    () =>
      dressCode.palette.map((tone) => (
        <div key={tone.name} className="palette-chip" role="listitem">
          <span
            className="palette-chip__swatch"
            style={{ backgroundColor: tone.hex }}
            aria-hidden="true"
          />
          <span className="palette-chip__name">{tone.name}</span>
        </div>
      )),
    [dressCode.palette],
  )

  return (
    <SectionBlock id="dress-code" subtitle="Дресс-код" title="Палитра вечера">
      <Reveal className="soft-card" y={24}>
        <p className="lead-text">{dressCode.text}</p>

        <div className="palette-grid" role="list">
          {paletteItems}
        </div>
      </Reveal>
    </SectionBlock>
  )
}

export const DressCodeSection = memo(DressCodeSectionBase)

DressCodeSection.displayName = 'DressCodeSection'
