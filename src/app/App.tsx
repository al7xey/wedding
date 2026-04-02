import { AnimatePresence, motion } from 'framer-motion'
import { lazy, memo, Suspense, useMemo } from 'react'
import { IntroOverlay } from '@/components/intro/IntroOverlay'
import { weddingContent } from '@/content/weddingContent'
import { useIntroState } from '@/hooks/useIntroState'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useViewportCssVars } from '@/hooks/useViewportCssVars'

const OrnamentalBackground = lazy(async () => {
  const module = await import('@/components/shared/OrnamentalBackground')
  return { default: module.OrnamentalBackground }
})

const InvitationContent = lazy(async () => {
  const module = await import('@/components/sections/InvitationContent')
  return { default: module.InvitationContent }
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

  const { isOpened, isAnimating, openIntro } = introState

  useViewportCssVars(isOpened)

  const names = useMemo(() => {
    const { first, connector, second } = weddingContent.coupleNames
    return `${first} ${connector} ${second}`
  }, [])

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

  const mainInitial = useMemo(() => {
    if (reducedMotion) {
      return { opacity: 1, y: 0, filter: 'blur(0px)' }
    }

    return { opacity: 0, y: 28, filter: 'blur(6px)' }
  }, [reducedMotion])

  return (
    <div className="site-shell">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <IntroOverlay
            monogram={weddingContent.coupleNames.monogram}
            names={names}
            date={weddingContent.weddingDate}
            onOpened={openIntro}
            reducedMotion={reducedMotion}
          />
        ) : (
          <motion.main
            key="invitation-main"
            className="invitation-main is-opened"
            initial={mainInitial}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={mainTransition}
          >
            <Suspense fallback={<SectionLoadingFallback />}>
              <OrnamentalBackground reducedMotion={reducedMotion} />
              <InvitationContent content={weddingContent} />
            </Suspense>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
