import { Link } from 'react-router-dom'
import { useQuestions } from '../hooks/useQuestions'
import { QUESTIONS } from '../lib/constants'
import { useClickSound } from '../hooks/useClickSound'
import { useBackgroundMusic } from '../hooks/useBackgroundMusic'
import { Progress } from '../components/Progress'
import { Card } from '../components/Card'
import { StartPopup } from '../components/StartPopup'
import { VolumeButton } from '../components/VolumeButton'
import { useState } from 'react'

export function ConnectsGame() {
  const {
    current,
    displayed,
    remaining,
    phase,
    direction,
    isCompleted,
    handleNext,
    handlePrev,
    reset,
  } = useQuestions()
  const total = Object.values(QUESTIONS).flat().length
  const { start: startBgMusic, muted, toggleMute } = useBackgroundMusic('/background.mp3', false)
  const { playClick } = useClickSound('/click.mp3', muted)
  const { playClick: playResetSound } = useClickSound('/faahhh.mp3', muted)
  const [started, setStarted] = useState(false)

  const handleReset = () => {
    playResetSound()
    reset()
  }

  const handleToggleMute = toggleMute

  if (!started) {
    return (
      <StartPopup
        onStart={() => {
          startBgMusic()
          setStarted(true)
        }}
        title="Connects"
        description="A question card game"
      />
    )
  }

  if (isCompleted) {
    return (
      <section className="w-full h-full">
        <div className="h-full flex flex-col justify-between gap-8">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-sm font-bold border-3 border-fg px-3 py-1 shadow-[3px_3px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Home
            </Link>
            <Progress remaining={0} total={total} onReset={handleReset} />
            <VolumeButton muted={muted} onToggle={handleToggleMute} />
          </div>
          <Card text="All questions completed! Great job." phase={phase} direction={direction} />
          <div className="flex gap-4">
            <button
              className="bg-primary w-full px-6 py-3 font-bold text-black uppercase shadow-[5px_5px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
              onClick={handleReset}
            >
              Start Over
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (!displayed && !current) {
    return null
  }

  return (
    <section className="w-full h-full">
      <div className="h-full flex flex-col justify-between gap-8">
        <div className="flex justify-between items-end gap-6">
          <Link
            to="/"
            className="text-sm font-bold border-3 border-fg px-3 py-1 shadow-[3px_3px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Home
          </Link>
          <Progress remaining={remaining} total={total} onReset={handleReset} />
          <VolumeButton muted={muted} onToggle={handleToggleMute} />
        </div>
        <div className="overflow-hidden">
          <Card text={current} phase={phase} direction={direction} />
        </div>
        <div className="flex gap-4">
          <button
            className="bg-bg w-full px-6 py-3 font-bold text-black uppercase border-3 border-fg shadow-[5px_5px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
            onClick={() => {
              playClick()
              handlePrev()
            }}
          >
            prev
          </button>
          <button
            className="bg-primary w-full px-6 py-3 font-bold text-black uppercase shadow-[5px_5px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
            onClick={() => {
              playClick()
              handleNext()
            }}
          >
            next card
          </button>
        </div>
      </div>
    </section>
  )
}
