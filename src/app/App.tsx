import { useEffect, useRef, useState } from 'react'

const COUNTDOWN_STEP_MS = 1000
const WEDDING_DATE_TIMESTAMP = new Date('2026-07-17T00:00:00+03:00').getTime()
const ROAD_PROGRESS_START = 0.16
const ROAD_PROGRESS_END = 1.2
const ROAD_SMOOTHING_FACTOR = 0.12
const VENUE_MAP_LINK = 'https://yandex.ru/maps/-/CPf4aPmn'
const VENUE_MAP_WIDGET_URL =
  'https://yandex.ru/map-widget/v1/?mode=search&text=%D0%B1%D0%B0%D0%BD%D0%BA%D0%B5%D1%82%D0%BD%D1%8B%D0%B9%20%D0%B7%D0%B0%D0%BB%20%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C,%20%D0%9C%D0%B0%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0,%2011%D0%90&z=17'

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

const storyPhotos = [
  {
    year: 'Март 2023',
    title: 'Знакомство',
    text: 'Играли деда и бабку в "Пасхальном колобке"',
    alt: 'Знакомство',
    imageSrc: '/images/story-1.jpg',
  },
  {
    year: 'Июнь 2023',
    title: 'Первое свидание',
    text: 'Одно из наших первых свиданий было на крыше',
    alt: 'Первое свидание',
    imageSrc: '/images/story-2.jpg',
  },
  {
    year: 'Август 2024',
    title: 'Первое путешествие',
    text: 'Душевная поездка в Оптину пустынь',
    alt: 'Первое совместное путешествие',
    imageSrc: '/images/story-3.jpg',
  },
  {
    year: 'Сентябрь 2024',
    title: 'Поступление в Москву',
    text: 'Почти 2 года отношений на расстоянии',
    alt: 'Поступление в Москву',
    imageSrc: '/images/story-4.jpg',
  },
  {
    year: 'Июль 2025',
    title: 'Да!',
    text: 'Незабываемое предложение руки и сердца в Москва-Сити',
    alt: 'Предложение',
    imageSrc: '/images/story-5.jpg',
  },
] as const

const storyPointClasses = [
  'story-board__point--1',
  'story-board__point--2',
  'story-board__point--3',
  'story-board__point--4',
  'story-board__point--5',
] as const

type StoryPathPoint = readonly [number, number]

const STORY_PATH_POINTS: readonly StoryPathPoint[] = [
  [456, 174],
  [722, 306],
  [722, 538],
  [126, 657],
  [250, 782],
  [712, 884],
  [688, 1010],
  [360, 1138],
  [366, 1220],
]

const STORY_PATH_SMOOTHNESS = 1
const CALENDAR_WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const
const JULY_2026_DAYS_IN_MONTH = 31
const JULY_2026_WEEK_START_OFFSET = 2
const WEDDING_DAY_OF_MONTH = 17
const JULY_2026_CALENDAR_CELLS: ReadonlyArray<number | null> = [
  ...Array.from({ length: JULY_2026_WEEK_START_OFFSET }, () => null),
  ...Array.from({ length: JULY_2026_DAYS_IN_MONTH }, (_, index) => index + 1),
]

const buildSmoothStoryPath = (points: readonly StoryPathPoint[]) => {
  if (points.length < 2) {
    return ''
  }

  const [startX, startY] = points[0]
  const controlScale = STORY_PATH_SMOOTHNESS / 6
  const segments = [`M${startX} ${startY}`]

  for (let index = 0; index < points.length - 1; index += 1) {
    const [x0, y0] = points[index > 0 ? index - 1 : index]
    const [x1, y1] = points[index]
    const [x2, y2] = points[index + 1]
    const [x3, y3] =
      index + 2 < points.length ? points[index + 2] : points[index + 1]

    const controlPoint1X = x1 + (x2 - x0) * controlScale
    const controlPoint1Y = y1 + (y2 - y0) * controlScale
    const controlPoint2X = x2 - (x3 - x1) * controlScale
    const controlPoint2Y = y2 - (y3 - y1) * controlScale

    segments.push(
      `C ${controlPoint1X.toFixed(1)} ${controlPoint1Y.toFixed(1)}, ${controlPoint2X.toFixed(1)} ${controlPoint2Y.toFixed(1)}, ${x2} ${y2}`,
    )
  }

  return segments.join(' ')
}

const STORY_PATH_D = buildSmoothStoryPath(STORY_PATH_POINTS)

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
const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const WeddingCalendarCard = () => {
  return (
    <article
      className="wedding-calendar reveal-on-scroll"
      data-reveal
      data-reveal-delay="100"
    >
      <div className="wedding-calendar__top">
        <p className="wedding-calendar__month">Июль 2026</p>
        <time className="wedding-calendar__date" dateTime="2026-07-17">
          17 июля
        </time>
      </div>

      <div className="wedding-calendar__grid" role="grid" aria-label="Календарь июля 2026">
        {CALENDAR_WEEKDAYS.map((weekDay) => (
          <span key={weekDay} className="wedding-calendar__weekday" aria-hidden="true">
            {weekDay}
          </span>
        ))}

        {JULY_2026_CALENDAR_CELLS.map((day, index) =>
          day === null ? (
            <span
              key={`empty-${index}`}
              className="wedding-calendar__day wedding-calendar__day--empty"
              aria-hidden="true"
            />
          ) : (
            <time
              key={day}
              className={`wedding-calendar__day${day === WEDDING_DAY_OF_MONTH ? ' wedding-calendar__day--wedding' : ''}`}
              dateTime={`2026-07-${formatTwoDigits(day)}`}
              aria-label={
                day === WEDDING_DAY_OF_MONTH
                  ? '17 июля 2026 — день свадьбы'
                  : `${day} июля 2026`
              }
            >
              {day}
            </time>
          ),
        )}
      </div>

      <p className="wedding-calendar__note">Пятница, 17 июля 2026</p>
    </article>
  )
}

const CountdownCard = () => {
  const [countdown, setCountdown] = useState(getCountdown)

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdown())

    updateCountdown()
    const timerId = window.setInterval(updateCountdown, COUNTDOWN_STEP_MS)

    return () => window.clearInterval(timerId)
  }, [])

  return (
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
  )
}

const useLazySectionVisibility = (rootMargin: string) => {
  const [isVisible, setIsVisible] = useState(false)
  const sentinelRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isVisible) {
      return
    }

    const sentinel = sentinelRef.current
    if (!sentinel) {
      return
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return
        }

        setIsVisible(true)
        currentObserver.disconnect()
      },
      {
        rootMargin,
        threshold: 0.01,
      },
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [isVisible, rootMargin])

  return { isVisible, sentinelRef }
}

const App = () => {
  const { isVisible: isTimelineVisible, sentinelRef: timelineSentinelRef } =
    useLazySectionVisibility('280px 0px')
  const { isVisible: isCountdownVisible, sentinelRef: countdownSentinelRef } =
    useLazySectionVisibility('220px 0px')

  useEffect(() => {
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    )

    if (revealItems.length === 0) {
      return
    }

    revealItems.forEach((item) => {
      item.style.transitionDelay = `${item.dataset.revealDelay ?? '0'}ms`
    })

    if (prefersReducedMotion()) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return
    }

    if (!('IntersectionObserver' in window)) {
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
      if (item.classList.contains('is-visible')) {
        return
      }

      observer.observe(item)
    })

    return () => observer.disconnect()
  }, [isTimelineVisible, isCountdownVisible])

  useEffect(() => {
    if (!isTimelineVisible) {
      return
    }

    const timelineList = document.querySelector<HTMLElement>('.timeline-list')
    if (!timelineList) {
      return
    }

    let isActive = false

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

    const enableTimelineSync = () => {
      if (isActive) {
        return
      }

      isActive = true
      requestAnimationFrame(syncTimelineLine)
      window.addEventListener('resize', syncTimelineLine)
      resizeObserver?.observe(timelineList)
    }

    const resizeObserver =
      'ResizeObserver' in window
        ? new ResizeObserver(syncTimelineLine)
        : null

    const activateObserver =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries, observer) => {
              if (!entries.some((entry) => entry.isIntersecting)) {
                return
              }

              observer.disconnect()
              enableTimelineSync()
            },
            {
              rootMargin: '220px 0px',
              threshold: 0.01,
            },
          )
        : null

    if (activateObserver) {
      activateObserver.observe(timelineList)
    } else {
      enableTimelineSync()
    }

    return () => {
      activateObserver?.disconnect()
      window.removeEventListener('resize', syncTimelineLine)
      resizeObserver?.disconnect()
    }
  }, [isTimelineVisible])

  useEffect(() => {
    const storyBoard = document.querySelector<HTMLElement>('.story-board')
    if (!storyBoard) {
      return
    }

    const photos = Array.from(
      storyBoard.querySelectorAll<HTMLElement>('.story-photo'),
    )

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value))

    if (prefersReducedMotion()) {
      storyBoard.style.setProperty('--story-progress', '1')
      photos.forEach((photo) => photo.style.setProperty('--story-photo-progress', '1'))
      return
    }

    let syncRafId = 0
    let roadAnimRafId = 0
    let hasActiveListeners = false
    let renderedRoadProgress = 0
    let targetRoadProgress = 0

    const animateRoadProgress = () => {
      roadAnimRafId = 0

      const delta = targetRoadProgress - renderedRoadProgress
      if (Math.abs(delta) <= 0.001) {
        renderedRoadProgress = targetRoadProgress
        storyBoard.style.setProperty('--story-progress', renderedRoadProgress.toFixed(3))
        return
      }

      renderedRoadProgress += delta * ROAD_SMOOTHING_FACTOR
      storyBoard.style.setProperty('--story-progress', renderedRoadProgress.toFixed(3))
      roadAnimRafId = requestAnimationFrame(animateRoadProgress)
    }

    const syncStoryProgress = () => {
      syncRafId = 0

      const rect = storyBoard.getBoundingClientRect()
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight
      const startPoint = viewportHeight * 0.9
      const endPoint = -rect.height * 0.62
      const progress = clamp(
        (startPoint - rect.top) / (startPoint - endPoint),
        0,
        1,
      )

      const rawRoadProgress = clamp(
        (progress - ROAD_PROGRESS_START) / (ROAD_PROGRESS_END - ROAD_PROGRESS_START),
        0,
        1,
      )
      const roadProgress =
        rawRoadProgress * rawRoadProgress * (3 - 2 * rawRoadProgress)
      targetRoadProgress = roadProgress

      if (roadAnimRafId === 0) {
        roadAnimRafId = requestAnimationFrame(animateRoadProgress)
      }

      const revealRangeStart = 0.14
      const revealRangeEnd = 0.92
      const segments = Math.max(1, photos.length - 1)
      const revealStep = (revealRangeEnd - revealRangeStart) / segments
      const revealDuration = Math.max(0.2, revealStep * 0.92)

      photos.forEach((photo, index) => {
        const revealStart = revealRangeStart + index * revealStep
        const photoProgress = clamp(
          (progress - revealStart) / revealDuration,
          0,
          1,
        )

        photo.style.setProperty('--story-photo-progress', photoProgress.toFixed(3))
      })
    }

    const requestSync = () => {
      if (syncRafId !== 0) {
        return
      }

      syncRafId = requestAnimationFrame(syncStoryProgress)
    }

    const enableStorySync = () => {
      if (hasActiveListeners) {
        return
      }

      hasActiveListeners = true
      syncStoryProgress()
      window.addEventListener('scroll', requestSync, { passive: true })
      window.addEventListener('resize', requestSync)
    }

    const activateObserver =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries, observer) => {
              if (!entries.some((entry) => entry.isIntersecting)) {
                return
              }

              observer.disconnect()
              enableStorySync()
            },
            {
              rootMargin: '260px 0px',
              threshold: 0.01,
            },
          )
        : null

    if (activateObserver) {
      activateObserver.observe(storyBoard)
    } else {
      enableStorySync()
    }

    return () => {
      activateObserver?.disconnect()
      if (syncRafId !== 0) {
        cancelAnimationFrame(syncRafId)
      }

      if (roadAnimRafId !== 0) {
        cancelAnimationFrame(roadAnimRafId)
      }

      if (hasActiveListeners) {
        window.removeEventListener('scroll', requestSync)
        window.removeEventListener('resize', requestSync)
      }
    }
  }, [])

  return (
    <>
      <div className="app-background" aria-hidden="true" />
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
                Дорогие родные и близкие, приглашаем вас на один из
                самых важных и счастливых дней нашей жизни. Ваше
                присутствие сделает этот праздник по-настоящему тёплым
                и незабываемым для нас. Нам очень важно, чтобы именно
                в этот день рядом были те, кто дорог нашему сердцу.
                Разделите с нами радость рождения новой семьи!
              </p>
            </article>
          </div>
        </section>

        <section className="inv-section story-section">
          <div className="container">
            <header className="section-head">
              <h2 className="section-title">Наша история</h2>
            </header>

            <div className="story-board">
              <svg
                className="story-board__line"
                viewBox="0 0 1000 1240"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <mask id="story-road-reveal">
                    <rect x="0" y="0" width="1000" height="1240" fill="black" />
                    <path
                      className="story-board__mask-path"
                      d={STORY_PATH_D}
                      pathLength={1}
                    />
                  </mask>
                </defs>

                <path
                  className="story-board__path story-board__path--active"
                  d={STORY_PATH_D}
                  mask="url(#story-road-reveal)"
                />
              </svg>

              {storyPointClasses.map((pointClass) => (
                <span
                  key={pointClass}
                  className={`story-board__point ${pointClass}`}
                  aria-hidden="true"
                />
              ))}

              {storyPhotos.map((photo, index) => (
                <article key={photo.title} className={`story-photo story-photo--${index + 1}`}>
                  <div className="story-photo__image-wrap">
                    <img
                      className="story-photo__image"
                      src={photo.imageSrc ?? '/images/wedding-bg-mobile.jpg'}
                      srcSet={
                        photo.imageSrc
                          ? `${photo.imageSrc} 1024w`
                          : '/images/wedding-bg-mobile.jpg 640w, /images/wedding-bg.jpg 1024w'
                      }
                      sizes="(max-width: 640px) 35vw, (max-width: 980px) 28vw, 286px"
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  </div>
                  <div className="story-photo__content">
                    <span className="story-photo__year">{photo.year}</span>
                    <h3 className="story-photo__title">{photo.title}</h3>
                    <p className="story-photo__text">{photo.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="inv-section wedding-date-section">
          <div className="container">
            <header className="section-head">
              <h2 className="section-title">Дата свадьбы</h2>
            </header>

            <WeddingCalendarCard />
          </div>
        </section>

        <section className="inv-section venue-section">
          <div className="container">
            <header className="section-head">
              <h2 className="section-title">Место проведения</h2>
            </header>

            <article className="venue-card reveal-on-scroll" data-reveal data-reveal-delay="100">
              <div className="venue-card__details">
                <p className="venue-card__label">Банкетный зал</p>
                <h3 className="venue-card__title">«Националь»</h3>
                <p className="venue-card__address">Магистральная улица, 11А</p>
                <a
                  className="venue-card__link"
                  href={VENUE_MAP_LINK}
                  target="_blank"
                  rel="noreferrer"
                >
                  Открыть в Яндекс Картах
                </a>
              </div>

              <div className="venue-card__map-wrap">
                <iframe
                  className="venue-card__map"
                  title="Карта: банкетный зал «Националь»"
                  src={VENUE_MAP_WIDGET_URL}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                <span className="venue-card__map-glass" aria-hidden="true" />
              </div>
            </article>
          </div>
        </section>

        {isTimelineVisible ? (
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
        ) : (
          <section
            ref={timelineSentinelRef}
            className="inv-section timeline-section lazy-section lazy-section--timeline"
            aria-hidden="true"
          >
            <div className="container">
              <div className="lazy-section__placeholder" />
            </div>
          </section>
        )}

        {isCountdownVisible ? (
          <section className="inv-section countdown-section">
            <div className="container">
              <header className="section-head">
                <h2 className="section-title">До свадьбы осталось</h2>
              </header>

              <CountdownCard />
            </div>
          </section>
        ) : (
          <section
            ref={countdownSentinelRef}
            className="inv-section countdown-section lazy-section lazy-section--countdown"
            aria-hidden="true"
          >
            <div className="container">
              <div className="lazy-section__placeholder" />
            </div>
          </section>
        )}

        <section className="inv-section final-message-section">
          <div className="container">
            <p className="final-message reveal-on-scroll" data-reveal data-reveal-delay="120">
              Ждем вас на нашей свадьбе!
            </p>
          </div>
        </section>

        </main>
      </div>
    </>
  )
}

export default App

