import { useEffect, useState } from 'react'

const invitation = {
  firstName: 'Алексей',
  secondName: 'Анастасия',
  date: '17 июля 2026',
  title: 'Мы будем рады вам',
  text1:
    'Дорогие родные и друзья, приглашаем вас разделить с нами один из самых важных дней нашей жизни.',
  text2:
    'Место проведения: загородная усадьба. Точный адрес и время отправим дополнительно.',
}

const WEDDING_DATE_TIMESTAMP = new Date('2026-07-17T00:00:00+03:00').getTime()

const getCountdown = () => {
  const diffMs = Math.max(0, WEDDING_DATE_TIMESTAMP - Date.now())

  const days = Math.floor(diffMs / 86_400_000)
  const hours = Math.floor((diffMs % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000)
  const seconds = Math.floor((diffMs % 60_000) / 1000)

  return { days, hours, minutes, seconds }
}

const formatTwoDigits = (value: number) => value.toString().padStart(2, '0')

const timelineItems = [
  {
    time: '15:30',
    title: 'Сбор гостей',
    description:
      'Welcome-зона и первые тосты. Точные детали появятся ближе к дате.',
  },
  {
    time: '16:15',
    title: 'Церемония',
    description:
      'Самый трогательный момент дня. Расположение площадки добавим в этом блоке.',
  },
  {
    time: '17:00',
    title: 'Фотосессия и аперитив',
    description: 'Время для живых кадров, музыки и легкого общения.',
  },
  {
    time: '18:00',
    title: 'Праздничный ужин',
    description: 'Теплая атмосфера, речь близких и первые танцы.',
  },
  {
    time: '21:30',
    title: 'Вечерняя программа',
    description: 'Финальная часть праздника. Подробности сценария скоро.',
  },
]

const App = () => {
  const [countdown, setCountdown] = useState(getCountdown)

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCountdown(getCountdown())
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]')

    if (reducedMotion) {
      revealItems.forEach((item) => {
        item.classList.add('is-visible')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    revealItems.forEach((item) => {
      const delayMs = item.getAttribute('data-reveal-delay') ?? '0'
      item.style.transitionDelay = `${delayMs}ms`
      observer.observe(item)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const timelineList = document.querySelector<HTMLElement>('.timeline-list')
    if (!timelineList) {
      return
    }

    const syncTimelineLine = () => {
      const dots = timelineList.querySelectorAll<HTMLElement>('.timeline-item__dot')
      if (dots.length === 0) {
        return
      }

      const firstDot = dots[0]
      const lastDot = dots[dots.length - 1]
      const listRect = timelineList.getBoundingClientRect()
      const firstRect = firstDot.getBoundingClientRect()
      const lastRect = lastDot.getBoundingClientRect()

      const lineLeft = firstRect.left + firstRect.width / 2 - listRect.left
      const lineTop = firstRect.top + firstRect.height / 2 - listRect.top
      const lineBottom = listRect.bottom - (lastRect.top + lastRect.height / 2)

      timelineList.style.setProperty('--timeline-line-left', `${lineLeft}px`)
      timelineList.style.setProperty('--timeline-line-top', `${Math.max(lineTop, 0)}px`)
      timelineList.style.setProperty('--timeline-line-bottom', `${Math.max(lineBottom, 0)}px`)
    }

    const syncOnNextFrame = requestAnimationFrame(syncTimelineLine)
    window.addEventListener('resize', syncTimelineLine)

    let resizeObserver: ResizeObserver | null = null
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => syncTimelineLine())
      resizeObserver.observe(timelineList)
    }

    return () => {
      cancelAnimationFrame(syncOnNextFrame)
      window.removeEventListener('resize', syncTimelineLine)
      resizeObserver?.disconnect()
    }
  }, [])

  return (
    <div className="site-shell">
      <main className="invitation-main">
        <section className="hero-screen">
          <div className="container">
            <div className="hero-screen__frame">
              <div className="hero-screen__center">
                <h1 className="hero-screen__title">
                  <span>{invitation.firstName}</span>
                  <span className="hero-screen__connector">и</span>
                  <span>{invitation.secondName}</span>
                </h1>
                <time className="hero-screen__date" dateTime="2026-07-17">
                  {invitation.date}
                </time>
              </div>
            </div>
          </div>
        </section>

        <section className="inv-section">
          <div className="container">
            <header className="section-head">
              <h2 className="section-title">{invitation.title}</h2>
            </header>
            <article className="soft-card reveal-on-scroll" data-reveal data-reveal-delay="80">
              <p className="lead-text">{invitation.text1}</p>
              <p className="lead-text">{invitation.text2}</p>
            </article>
          </div>
        </section>

        <section className="inv-section timeline-section">
          <div className="container">
            <header className="section-head">
              <h2 className="section-title">План праздника</h2>
            </header>

            <div className="timeline-list">
              {timelineItems.map((item, index) => (
                <article
                  className="timeline-item reveal-on-scroll"
                  key={`${item.time}-${item.title}`}
                  data-reveal
                  data-reveal-delay={String(90 + index * 75)}
                >
                  <p className="timeline-item__time">{item.time}</p>
                  <span className="timeline-item__dot" aria-hidden="true" />
                  <div className="timeline-item__content">
                    <h3 className="timeline-item__title">{item.title}</h3>
                    <p className="timeline-item__description">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="inv-section countdown-section">
          <div className="container">
            <header className="section-head">
              <h2 className="section-title">До свадьбы осталось</h2>
            </header>
            <div className="countdown-card reveal-on-scroll" data-reveal data-reveal-delay="60">
              <div className="countdown-grid">
                <article className="countdown-item">
                  <p className="countdown-item__value">{countdown.days}</p>
                  <p className="countdown-item__label">дней</p>
                </article>

                <article className="countdown-item">
                  <p className="countdown-item__value">{formatTwoDigits(countdown.hours)}</p>
                  <p className="countdown-item__label">часов</p>
                </article>

                <article className="countdown-item">
                  <p className="countdown-item__value">{formatTwoDigits(countdown.minutes)}</p>
                  <p className="countdown-item__label">минут</p>
                </article>

                <article className="countdown-item">
                  <p className="countdown-item__value">{formatTwoDigits(countdown.seconds)}</p>
                  <p className="countdown-item__label">секунд</p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
