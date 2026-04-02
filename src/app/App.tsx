import { AnimatePresence, motion } from 'framer-motion'
import { lazy, memo, Suspense, useMemo } from 'react'
import { IntroOverlay } from '@/components/intro/IntroOverlay'
import { OrnamentalBackground } from '@/components/shared/OrnamentalBackground'
import { weddingContent } from '@/content/weddingContent'
import { useIntroState } from '@/hooks/useIntroState'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useViewportCssVars } from '@/hooks/useViewportCssVars'

const HeroSection = lazy(async () => {
  const module = await import('@/components/sections/HeroSection')
  return { default: module.HeroSection }
})

const CountdownSection = lazy(async () => {
  const module = await import('@/components/sections/CountdownSection')
  return { default: module.CountdownSection }
})

const GreetingSection = lazy(async () => {
  const module = await import('@/components/sections/GreetingSection')
  return { default: module.GreetingSection }
})

const StorySection = lazy(async () => {
  const module = await import('@/components/sections/StorySection')
  return { default: module.StorySection }
})

const PhotoGallerySection = lazy(async () => {
  const module = await import('@/components/sections/PhotoGallerySection')
  return { default: module.PhotoGallerySection }
})

const TimelineSection = lazy(async () => {
  const module = await import('@/components/sections/TimelineSection')
  return { default: module.TimelineSection }
})

const VenueSection = lazy(async () => {
  const module = await import('@/components/sections/VenueSection')
  return { default: module.VenueSection }
})

const DressCodeSection = lazy(async () => {
  const module = await import('@/components/sections/DressCodeSection')
  return { default: module.DressCodeSection }
})

const WishesSection = lazy(async () => {
  const module = await import('@/components/sections/WishesSection')
  return { default: module.WishesSection }
})

const FinalSection = lazy(async () => {
  const module = await import('@/components/sections/FinalSection')
  return { default: module.FinalSection }
})

const APP_EASE = [0.22, 1, 0.36, 1] as const

const SectionLoadingFallback = memo(() => {
  return (
    <section className="inv-section sections-fallback" aria-hidden="true">
      <div className="container">
        <div className="sections-fallback__card" />
      </div>
    </section>
  )
})

SectionLoadingFallback.displayName = 'SectionLoadingFallback'

const App = () => {
  const introState = useIntroState()
  const reducedMotion = usePrefersReducedMotion()

  useViewportCssVars()

  const { isOpened, isAnimating, openIntro } = introState

  const names = useMemo(() => {
    const { first, connector, second } = weddingContent.coupleNames
    return `${first} ${connector} ${second}`
  }, [])

  const mainClassName = useMemo(
    () => `invitation-main ${isOpened ? 'is-opened' : 'is-locked'}`,
    [isOpened],
  )

  const mainAnimation = useMemo(
    () =>
      isOpened
        ? { opacity: 1, y: 0, filter: 'blur(0px)' }
        : { opacity: 0, y: 28, filter: 'blur(6px)' },
    [isOpened],
  )

  const mainTransition = useMemo(() => {
    if (reducedMotion) {
      return { duration: 0.2 }
    }

    return {
      duration: 1.02,
      ease: APP_EASE,
      delay: isAnimating ? 0.08 : 0,
    }
  }, [isAnimating, reducedMotion])

  return (
    <div className="site-shell">
      <OrnamentalBackground reducedMotion={reducedMotion} />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <IntroOverlay
            monogram={weddingContent.coupleNames.monogram}
            names={names}
            date={weddingContent.weddingDate}
            onOpened={openIntro}
            reducedMotion={reducedMotion}
          />
        ) : null}
      </AnimatePresence>

      <motion.main
        className={mainClassName}
        initial={false}
        animate={mainAnimation}
        transition={mainTransition}
        aria-hidden={!isOpened}
      >
        <Suspense fallback={<SectionLoadingFallback />}>
          <HeroSection content={weddingContent} />
          <CountdownSection />
          <GreetingSection text={weddingContent.greeting} />
          <StorySection story={weddingContent.story} />
          <PhotoGallerySection photos={weddingContent.photos} />
          <TimelineSection items={weddingContent.timeline} />
          <VenueSection venue={weddingContent.venue} />
          <DressCodeSection dressCode={weddingContent.dressCode} />
          <WishesSection wishes={weddingContent.wishes} />
          <FinalSection content={weddingContent.finalBlock} />
        </Suspense>
      </motion.main>
    </div>
  )
}

export default App
