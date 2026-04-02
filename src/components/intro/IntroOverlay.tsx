import { motion } from 'framer-motion'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

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
  sealBreaking: { scale: 1.008, y: -2, opacity: 1 },
  flapOpening: { scale: 1.015, y: -6, opacity: 1 },
  letterRise: { scale: 1.02, y: -10, opacity: 1 },
  finale: { scale: 0.99, y: -20, opacity: 0 },
}

const flapVariants = {
  idle: { rotateX: 0, opacity: 1 },
  sealBreaking: { rotateX: 0, opacity: 1 },
  flapOpening: { rotateX: -158, opacity: 0.98 },
  letterRise: { rotateX: -166, opacity: 0.92 },
  finale: { rotateX: -166, opacity: 0.2 },
}

const letterVariants = {
  idle: { y: 56, scale: 0.97, opacity: 0 },
  sealBreaking: { y: 54, scale: 0.97, opacity: 0 },
  flapOpening: { y: 18, scale: 1, opacity: 1 },
  letterRise: { y: -70, scale: 1.04, opacity: 1 },
  finale: { y: -200, scale: 1.12, opacity: 0 },
}

const sealVariants = {
  idle: { opacity: 1, scale: 1, rotate: 0 },
  sealBreaking: {
    opacity: [1, 1, 0.66],
    scale: [1, 1.09, 0.9],
    rotate: [0, 10, -6, 0],
  },
  flapOpening: { opacity: 0.3, scale: 0.84, rotate: 0 },
  letterRise: { opacity: 0, scale: 0.74, rotate: 0 },
  finale: { opacity: 0, scale: 0.74, rotate: 0 },
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
      transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
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
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="envelope__body">
        <div className="envelope__back" />

        <motion.div
          className="envelope__letter"
          variants={letterVariants}
          transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
        >
          <EnvelopeLetter names={names} date={date} />
        </motion.div>

        <div className="envelope__front" />
        <div className="envelope__fold envelope__fold--left" />
        <div className="envelope__fold envelope__fold--right" />

        <motion.div
          className="envelope__flap"
          variants={flapVariants}
          transition={{ duration: 0.88, ease: [0.22, 1, 0.36, 1] }}
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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const playSequence = useCallback(async () => {
    if (isRunning) {
      return
    }

    setIsRunning(true)

    if (reducedMotion) {
      setPhase('finale')
      await wait(180)
      onOpened()
      return
    }

    setPhase('sealBreaking')
    await wait(320)

    setPhase('flapOpening')
    await wait(700)

    setPhase('letterRise')
    await wait(760)

    setPhase('finale')
    await wait(420)

    onOpened()
  }, [isRunning, onOpened, reducedMotion])

  const flapOpened = useMemo(() => hasReached(phase, 'flapOpening'), [phase])
  const sealCracked = useMemo(() => hasReached(phase, 'sealBreaking'), [phase])

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
          className="envelope-trigger"
          onClick={playSequence}
          disabled={isRunning}
          whileHover={
            reducedMotion || isRunning ? undefined : { scale: 1.015, y: -2 }
          }
          whileTap={
            reducedMotion || isRunning ? undefined : { scale: 0.996, y: 1 }
          }
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



