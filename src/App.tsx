import { useQuestions } from './hooks/useQuestions'
import { Progress } from './components/Progress'
import { Card } from './components/Card'

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

  if (isCompleted) {
    return (
      <section className="w-full h-full">
        <div className="h-full flex flex-col justify-between gap-8">
          <Progress remaining={0} onReset={reset} />
          <Card text="All questions completed! Great job." phase={phase} direction={direction} />
          <div className="flex gap-4">
            <button
              className="bg-primary w-full px-6 py-3 font-bold text-black uppercase shadow-[5px_5px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
              onClick={reset}
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
        <Progress remaining={remaining} onReset={reset} />
        <Card text={current} phase={phase} direction={direction} />
        <div className="flex gap-4">
          <button
            className="bg-bg w-full px-6 py-3 font-bold text-black uppercase border-3 border-fg shadow-[5px_5px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
            onClick={handlePrev}
          >
            prev
          </button>
          <button
            className="bg-primary w-full px-6 py-3 font-bold text-black uppercase shadow-[5px_5px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
            onClick={handleNext}
          >
            next card
          </button>
        </div>
      </div>
    </section>
  )
}
