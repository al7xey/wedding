import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { IntroState } from '@/types/wedding'

const HERO_REVEAL_DURATION_MS = 520

interface IntroInternalState {
  isOpened: boolean
  isAnimating: boolean
}

const INITIAL_STATE: IntroInternalState = {
  isOpened: false,
  isAnimating: false,
}

export const useIntroState = (): IntroState => {
  const [state, setState] = useState<IntroInternalState>(INITIAL_STATE)

  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearAnimationTimeout = useCallback(() => {
    if (!animationTimeoutRef.current) {
      return
    }

    clearTimeout(animationTimeoutRef.current)
    animationTimeoutRef.current = null
  }, [])

  const finishAnimationWindow = useCallback(() => {
    clearAnimationTimeout()

    animationTimeoutRef.current = setTimeout(() => {
      setState((previous) => ({ ...previous, isAnimating: false }))
      animationTimeoutRef.current = null
    }, HERO_REVEAL_DURATION_MS)
  }, [clearAnimationTimeout])

  const openIntro = useCallback(() => {
    setState((previous) => ({
      ...previous,
      isOpened: true,
      isAnimating: true,
    }))

    finishAnimationWindow()
  }, [finishAnimationWindow])

  useEffect(() => {
    return () => {
      clearAnimationTimeout()
    }
  }, [clearAnimationTimeout])

  return useMemo(
    () => ({
      isOpened: state.isOpened,
      isAnimating: state.isAnimating,
      openIntro,
    }),
    [openIntro, state],
  )
}
