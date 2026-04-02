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
  sealBreaking: 360,
  flapOpening: 760,
  letterRise: 980,
  finale: 480,
} as const

const BASE_EASE = [0.22, 0.61, 0.36, 1] as const
const EMPHASIS_EASE = [0.33, 1, 0.68, 1] as const

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
  sealBreaking: { scale: 1.002, y: -1, opacity: 1 },
  flapOpening: { scale: 1.008, y: -4, opacity: 1 },
  letterRise: { scale: 1.012, y: -8, opacity: 1 },
  finale: { scale: 0.997, y: -14, opacity: 0 },
}

const flapVariants = {
  idle: { rotateX: 0, opacity: 1 },
  sealBreaking: { rotateX: 0, opacity: 1 },
  flapOpening: { rotateX: -144, opacity: 0.98 },
  letterRise: { rotateX: -154, opacity: 0.95 },
  finale: { rotateX: -154, opacity: 0.28 },
}

const letterVariants = {
  idle: { y: 62, scale: 0.97, opacity: 0 },
  sealBreaking: { y: 60, scale: 0.97, opacity: 0 },
  flapOpening: { y: 30, scale: 0.995, opacity: 1 },
  letterRise: { y: -74, scale: 1.035, opacity: 1 },
  finale: { y: -170, scale: 1.08, opacity: 0 },
}

const sealVariants = {
  idle: { opacity: 1, scale: 1, rotate: 0 },
  sealBreaking: {
    opacity: [1, 0.96, 0.72],
    scale: [1, 1.04, 0.92],
    rotate: [0, 6, -4, 0],
  },
  flapOpening: { opacity: 0.26, scale: 0.84, rotate: 0 },
  letterRise: { opacity: 0, scale: 0.75, rotate: 0 },
  finale: { opacity: 0, scale: 0.75, rotate: 0 },
}

const EnvelopeLetterBase = ({ names, date }: EnvelopeLetterProps) => {
  return (
    <>
      <p className="envelope__letter-label">Р РЋР Р†Р В°Р Т‘Р ВµР В±Р Р…Р С•Р Вµ Р С—РЎР‚Р С‘Р С–Р В»Р В°РЎв‚¬Р ВµР Р…Р С‘Р Вµ</p>
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
      transition={{ duration: 0.78, ease: EMPHASIS_EASE }}
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
      transition={{ duration: 1.08, ease: BASE_EASE }}
    >
      <div className="envelope__body">
        <div className="envelope__back" />

        <motion.div
          className="envelope__letter"
          variants={letterVariants}
          transition={{ duration: 1.16, ease: EMPHASIS_EASE }}
        >
          <EnvelopeLetter names={names} date={date} />
        </motion.div>

        <div className="envelope__front" />
        <div className="envelope__fold envelope__fold--left" />
        <div className="envelope__fold envelope__fold--right" />

        <motion.div
          className="envelope__flap"
          variants={flapVariants}
          transition={{ duration: 1.08, ease: EMPHASIS_EASE }}
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
    mountedRef.current = true

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
      exit={{ opacity: 0, transition: { duration: 0.52, ease: BASE_EASE } }}
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
          aria-label="Р С›РЎвЂљР С”РЎР‚РЎвЂ№РЎвЂљРЎРЉ РЎРѓР Р†Р В°Р Т‘Р ВµР В±Р Р…Р С•Р Вµ Р С—РЎР‚Р С‘Р С–Р В»Р В°РЎв‚¬Р ВµР Р…Р С‘Р Вµ"
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
