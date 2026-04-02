import { motion } from 'framer-motion'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

type IntroPhase =
  | 'idle'
  | 'sealBreaking'
  | 'flapOpening'
  | 'letterRise'
  | 'finale'

interface IntroOverlayProps {
  monogram: string
  names: string
  date: string
  onOpened: () => void
  reducedMotion: boolean
}

interface EnvelopeLetterProps {
  names: string
  date: string
}

interface WaxSealProps {
  monogram: string
  isCracked: boolean
}

interface EnvelopeSceneProps {
  phase: IntroPhase
  flapOpened: boolean
  sealCracked: boolean
  monogram: string
  names: string
  date: string
}

const PHASE_ORDER: Record<IntroPhase, number> = {
  idle: 0,
  sealBreaking: 1,
  flapOpening: 2,
  letterRise: 3,
  finale: 4,
}

const PHASE_DELAY_MS = {
  sealBreaking: 280,
  flapOpening: 620,
  letterRise: 760,
  finale: 360,
} as const

const BASE_EASE = [0.22, 1, 0.36, 1] as const
const EMPHASIS_EASE = [0.16, 1, 0.3, 1] as const

const wait = async (milliseconds: number): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

const hasReached = (phase: IntroPhase, target: IntroPhase): boolean => {
  return PHASE_ORDER[phase] >= PHASE_ORDER[target]
}

const envelopeVariants = {
  idle: { scale: 1, y: 0, opacity: 1 },
  sealBreaking: { scale: 1.004, y: -1, opacity: 1 },
  flapOpening: { scale: 1.012, y: -6, opacity: 1 },
  letterRise: { scale: 1.02, y: -12, opacity: 1 },
  finale: { scale: 0.994, y: -20, opacity: 0 },
}

const flapVariants = {
  idle: { rotateX: 0, opacity: 1 },
  sealBreaking: { rotateX: 0, opacity: 1 },
  flapOpening: { rotateX: -156, opacity: 0.98 },
  letterRise: { rotateX: -164, opacity: 0.92 },
  finale: { rotateX: -164, opacity: 0.2 },
}

const letterVariants = {
  idle: { y: 62, scale: 0.97, opacity: 0 },
  sealBreaking: { y: 58, scale: 0.97, opacity: 0 },
  flapOpening: { y: 20, scale: 1, opacity: 1 },
  letterRise: { y: -90, scale: 1.05, opacity: 1 },
  finale: { y: -220, scale: 1.12, opacity: 0 },
}

const sealVariants = {
  idle: { opacity: 1, scale: 1, rotate: 0 },
  sealBreaking: {
    opacity: [1, 1, 0.64],
    scale: [1, 1.07, 0.9],
    rotate: [0, 9, -7, 0],
  },
  flapOpening: { opacity: 0.26, scale: 0.84, rotate: 0 },
  letterRise: { opacity: 0, scale: 0.75, rotate: 0 },
  finale: { opacity: 0, scale: 0.75, rotate: 0 },
}

const EnvelopeLetterBase = ({ names, date }: EnvelopeLetterProps) => {
  return (
    <>
      <p className="envelope__letter-label">Свадебное приглашение</p>
      <p className="envelope__letter-names">{names}</p>
      <p className="envelope__letter-date">{date}</p>
    </>
  )
}

const EnvelopeLetter = memo(EnvelopeLetterBase)
EnvelopeLetter.displayName = 'EnvelopeLetter'

const WaxSealBase = ({ monogram, isCracked }: WaxSealProps) => {
  return (
    <motion.div
      className={`wax-seal ${isCracked ? 'is-cracked' : ''}`}
      variants={sealVariants}
      transition={{ duration: 0.46, ease: EMPHASIS_EASE }}
    >
      <span className="wax-seal__monogram">{monogram}</span>
      <span className="wax-seal__fragment wax-seal__fragment--1" />
      <span className="wax-seal__fragment wax-seal__fragment--2" />
      <span className="wax-seal__fragment wax-seal__fragment--3" />
      <span className="wax-seal__fragment wax-seal__fragment--4" />
    </motion.div>
  )
}

const WaxSeal = memo(WaxSealBase)
WaxSeal.displayName = 'WaxSeal'

const EnvelopeSceneBase = ({
  phase,
  flapOpened,
  sealCracked,
  monogram,
  names,
  date,
}: EnvelopeSceneProps) => {
  return (
    <motion.div
      className="envelope"
      initial={false}
      animate={phase}
      variants={envelopeVariants}
      transition={{ duration: 0.62, ease: BASE_EASE }}
    >
      <div className="envelope__body">
        <div className="envelope__back" />

        <motion.div
          className="envelope__letter"
          variants={letterVariants}
          transition={{ duration: 0.74, ease: EMPHASIS_EASE }}
        >
          <EnvelopeLetter names={names} date={date} />
        </motion.div>

        <div className="envelope__front" />
        <div className="envelope__fold envelope__fold--left" />
        <div className="envelope__fold envelope__fold--right" />

        <motion.div
          className="envelope__flap"
          variants={flapVariants}
          transition={{ duration: 0.7, ease: EMPHASIS_EASE }}
        />

        <div className="wax-seal-anchor">
          <WaxSeal monogram={monogram} isCracked={sealCracked} />
        </div>

        <div className="envelope__sparkle-anchor">
          <span
            className={`envelope__sparkle ${flapOpened ? 'is-visible' : ''}`}
            aria-hidden="true"
          />
        </div>
      </div>
    </motion.div>
  )
}

const EnvelopeScene = memo(EnvelopeSceneBase)
EnvelopeScene.displayName = 'EnvelopeScene'

const IntroOverlayBase = ({
  monogram,
  names,
  date,
  onOpened,
  reducedMotion,
}: IntroOverlayProps) => {
  const [phase, setPhase] = useState<IntroPhase>('idle')
  const [isRunning, setIsRunning] = useState(false)
  const mountedRef = useRef(true)
  const runningRef = useRef(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      mountedRef.current = false
      runningRef.current = false
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const playSequence = useCallback(async () => {
    if (runningRef.current) {
      return
    }

    runningRef.current = true
    setIsRunning(true)

    if (reducedMotion) {
      setPhase('finale')
      await wait(120)

      if (mountedRef.current) {
        runningRef.current = false
        onOpened()
      }

      return
    }

    setPhase('sealBreaking')
    await wait(PHASE_DELAY_MS.sealBreaking)

    if (!mountedRef.current) {
      return
    }

    setPhase('flapOpening')
    await wait(PHASE_DELAY_MS.flapOpening)

    if (!mountedRef.current) {
      return
    }

    setPhase('letterRise')
    await wait(PHASE_DELAY_MS.letterRise)

    if (!mountedRef.current) {
      return
    }

    setPhase('finale')
    await wait(PHASE_DELAY_MS.finale)

    if (mountedRef.current) {
      runningRef.current = false
      onOpened()
    }
  }, [onOpened, reducedMotion])

  const flapOpened = useMemo(() => hasReached(phase, 'flapOpening'), [phase])
  const sealCracked = useMemo(() => hasReached(phase, 'sealBreaking'), [phase])

  const triggerClassName = useMemo(
    () => `envelope-trigger${isRunning ? ' is-running' : ''}`,
    [isRunning],
  )

  const isInteractive = !reducedMotion && !isRunning && phase === 'idle'

  return (
    <motion.div
      className="intro-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
    >
      <div className="intro-overlay__grain" />

      <div className="intro-overlay__inner">
        <motion.button
          type="button"
          className={triggerClassName}
          onClick={playSequence}
          disabled={isRunning}
          whileHover={isInteractive ? { scale: 1.012, y: -1.5 } : undefined}
          whileTap={isInteractive ? { scale: 0.997, y: 1 } : undefined}
          aria-label="Открыть свадебное приглашение"
        >
          <EnvelopeScene
            phase={phase}
            flapOpened={flapOpened}
            sealCracked={sealCracked}
            monogram={monogram}
            names={names}
            date={date}
          />
        </motion.button>
      </div>
    </motion.div>
  )
}

export const IntroOverlay = memo(IntroOverlayBase)

IntroOverlay.displayName = 'IntroOverlay'

