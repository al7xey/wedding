import { memo, useEffect, useMemo, useState } from 'react'
import { Reveal } from '@/components/shared/Reveal'
import { SectionBlock } from '@/components/shared/SectionBlock'

interface CountdownPart {
  label: string
  value: number
}

const WEDDING_DATE = new Date('2026-07-17T00:00:00+03:00')
const SECOND_MS = 1000
const MINUTE_MS = 60 * SECOND_MS
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

const getRemainingTime = (targetDate: Date) => {
  const now = Date.now()
  const diff = targetDate.getTime() - now

  if (diff <= 0) {
    return {
      isPast: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  const days = Math.floor(diff / DAY_MS)
  const hours = Math.floor((diff % DAY_MS) / HOUR_MS)
  const minutes = Math.floor((diff % HOUR_MS) / MINUTE_MS)
  const seconds = Math.floor((diff % MINUTE_MS) / SECOND_MS)

  return {
    isPast: false,
    days,
    hours,
    minutes,
    seconds,
  }
}

const CountdownSectionBase = () => {
  const [remainingTime, setRemainingTime] = useState(() =>
    getRemainingTime(WEDDING_DATE),
  )

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setRemainingTime(getRemainingTime(WEDDING_DATE))
    }, SECOND_MS)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  const items = useMemo<CountdownPart[]>(() => {
    return [
      { label: 'дней', value: remainingTime.days },
      { label: 'часов', value: remainingTime.hours },
      { label: 'минут', value: remainingTime.minutes },
      { label: 'секунд', value: remainingTime.seconds },
    ]
  }, [remainingTime.days, remainingTime.hours, remainingTime.minutes, remainingTime.seconds])

  return (
    <SectionBlock
      id="countdown"
      subtitle="Обратный отсчет"
      title="До свадьбы осталось"
      className="countdown-section"
    >
      <Reveal className="countdown-card" y={18}>
        {remainingTime.isPast ? (
          <p className="countdown-card__done">Сегодня наш свадебный день</p>
        ) : (
          <div className="countdown-grid" role="list" aria-label="Обратный отсчет до свадьбы">
            {items.map((item) => (
              <div className="countdown-item" role="listitem" key={item.label}>
                <span className="countdown-item__value">{String(item.value).padStart(2, '0')}</span>
                <span className="countdown-item__label">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </SectionBlock>
  )
}

export const CountdownSection = memo(CountdownSectionBase)

CountdownSection.displayName = 'CountdownSection'
