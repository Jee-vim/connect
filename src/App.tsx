import { useQuestions } from './hooks/useQuestions'
import { QUESTIONS } from './lib/constants'
import { useClickSound } from './hooks/useClickSound'
import { useBackgroundMusic } from './hooks/useBackgroundMusic'
import { Progress } from './components/Progress'
import { Card } from './components/Card'
import { StartPopup } from './components/StartPopup'
import { useState } from 'react'

export default function App() {
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
  const total = QUESTIONS.length
  const { playClick } = useClickSound()
  const { playClick: playResetSound } = useClickSound('/faahhh.mp3')
  const { start: startBgMusic } = useBackgroundMusic()
  const [started, setStarted] = useState(false)

  const handleReset = () => {
    playResetSound()
    reset()
  }

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
          <Progress remaining={0} total={total} onReset={handleReset} />
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
        <Progress remaining={remaining} total={total} onReset={handleReset} />
        <Card text={current} phase={phase} direction={direction} />
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
