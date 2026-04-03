import { useEffect, useState } from 'react'

const COUNTDOWN_STEP_MS = 1000
const WEDDING_DATE_TIMESTAMP = new Date('2026-07-17T00:00:00+03:00').getTime()

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
] as const

const storyItems = [
  {
    year: '2022',
    title: 'Первая встреча',
    text: 'День, с которого все началось.',
    image: '/images/story-1.jpg',
    className: 'story-photo--1',
  },
  {
    year: '2023',
    title: 'Первые путешествия',
    text: 'Мы начали собирать наши любимые моменты вместе.',
    image: '/images/story-2.jpg',
    className: 'story-photo--2',
  },
  {
    year: '2024',
    title: 'Еще ближе',
    text: 'Каждый день рядом становился все важнее.',
    image: '/images/story-3.jpg',
    className: 'story-photo--3',
  },
  {
    year: '2026',
    title: 'Самый важный день',
    text: 'И теперь мы приглашаем вас разделить его с нами.',
    image: '/images/story-4.jpg',
    className: 'story-photo--4',
  },
] as const

const getCountdown = () => {
  const diffMs = Math.max(0, WEDDING_DATE_TIMESTAMP - Date.now())

  return {
    days: Math.floor(diffMs / 86_400_000),
    hours: Math.floor((diffMs % 86_400_000) / 3_600_000),
    minutes: Math.floor((diffMs % 3_600_000) / 60_000),
    seconds: Math.floor((diffMs % 60_000) / 1000),
  }
}

const formatTwoDigits = (value: number) => String(value).padStart(2, '0')

const App = () => {
  const [countdown, setCountdown] = useState(getCountdown)

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdown())

    updateCountdown()
    const timerId = window.setInterval(updateCountdown, COUNTDOWN_STEP_MS)

    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    )

    if (revealItems.length === 0) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add('is-visible')
          currentObserver.unobserve(entry.target)
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    revealItems.forEach((item) => {
      item.style.transitionDelay = `${item.dataset.revealDelay ?? '0'}ms`
      observer.observe(item)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const timelineList = document.querySelector<HTMLElement>('.timeline-list')
    if (!timelineList) {
      return
    }

    const getRelativeOffset = (node: HTMLElement, ancestor: HTMLElement) => {
      let left = 0
      let top = 0
      let current: HTMLElement | null = node

      while (current && current !== ancestor) {
        left += current.offsetLeft
        top += current.offsetTop
        current = current.offsetParent as HTMLElement | null
      }

      return { left, top }
    }

    const syncTimelineLine = () => {
      const dots = timelineList.querySelectorAll<HTMLElement>('.timeline-item__dot')
      if (dots.length < 2) {
        return
      }

      const firstDot = dots[0]
      const lastDot = dots[dots.length - 1]

      const firstOffset = getRelativeOffset(firstDot, timelineList)
      const lastOffset = getRelativeOffset(lastDot, timelineList)

      const lineLeft = firstOffset.left + firstDot.offsetWidth / 2
      const lineTop = firstOffset.top + firstDot.offsetHeight / 2
      const lineBottom =
        timelineList.offsetHeight - (lastOffset.top + lastDot.offsetHeight / 2)

      timelineList.style.setProperty('--timeline-line-left', `${lineLeft}px`)
      timelineList.style.setProperty('--timeline-line-top', `${Math.max(0, lineTop)}px`)
      timelineList.style.setProperty(
        '--timeline-line-bottom',
        `${Math.max(0, lineBottom)}px`,
      )
    }

    const frameId = requestAnimationFrame(syncTimelineLine)
    window.addEventListener('resize', syncTimelineLine)

    const resizeObserver =
      'ResizeObserver' in window
        ? new ResizeObserver(syncTimelineLine)
        : null

    resizeObserver?.observe(timelineList)

    return () => {
      cancelAnimationFrame(frameId)
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
                  <span>Алексей</span>
                  <span className="hero-screen__connector">и</span>
                  <span>Анастасия</span>
                </h1>
                <time className="hero-screen__date" dateTime="2026-07-17">
                  17 июля 2026
                </time>
              </div>
            </div>
          </div>
        </section>

        <section className="inv-section">
          <div className="container">
            <header className="section-head">
              <h2 className="section-title">Мы будем рады вам</h2>
            </header>

            <article
              className="soft-card reveal-on-scroll"
              data-reveal
              data-reveal-delay="80"
            >
              <p className="lead-text">
                Дорогие родные и друзья, приглашаем вас разделить 
                с нами один из самых важных дней нашей жизни.
              </p>
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
                  key={`${item.time}-${item.title}`}
                  className="timeline-item reveal-on-scroll"
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

            <div
              className="countdown-card reveal-on-scroll"
              data-reveal
              data-reveal-delay="60"
            >
              <div className="countdown-grid">
                <article className="countdown-item">
                  <p className="countdown-item__value">{countdown.days}</p>
                  <p className="countdown-item__label">дней</p>
                </article>

                <article className="countdown-item">
                  <p className="countdown-item__value">
                    {formatTwoDigits(countdown.hours)}
                  </p>
                  <p className="countdown-item__label">часов</p>
                </article>

                <article className="countdown-item">
                  <p className="countdown-item__value">
                    {formatTwoDigits(countdown.minutes)}
                  </p>
                  <p className="countdown-item__label">минут</p>
                </article>

                <article className="countdown-item">
                  <p className="countdown-item__value">
                    {formatTwoDigits(countdown.seconds)}
                  </p>
                  <p className="countdown-item__label">секунд</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="inv-section story-section">
          <div className="container">
            <header className="section-head">
              <h2 className="section-title">Наша история</h2>
            </header>

            <div
              className="story-board reveal-on-scroll"
              data-reveal
              data-reveal-delay="80"
            >
              <svg
                className="story-board__line"
                viewBox="0 0 1200 900"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M180 130
                    C 320 120, 390 240, 500 270
                    S 710 340, 770 430
                    S 600 610, 470 640
                    S 650 760, 860 760"
                />
              </svg>

              <span className="story-board__point story-board__point--1" />
              <span className="story-board__point story-board__point--2" />
              <span className="story-board__point story-board__point--3" />
              <span className="story-board__point story-board__point--4" />

              {storyItems.map((item) => (
                <article
                  key={item.year + item.title}
                  className={`story-photo ${item.className}`}
                >
                  <div className="story-photo__image-wrap">
                    <img
                      className="story-photo__image"
                      src={item.image}
                      alt={item.title}
                    />
                  </div>

                  <div className="story-photo__content">
                    <span className="story-photo__year">{item.year}</span>
                    <h3 className="story-photo__title">{item.title}</h3>
                    <p className="story-photo__text">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App