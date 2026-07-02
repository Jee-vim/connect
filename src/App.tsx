import './App.css'
import { useState, useEffect } from 'react'
import { QUESTION } from './lib/contants'
import { getStorage, setStorage, clearStorage } from './lib/storage'

const SHOWN_KEY = 'connects_shown_questions';

function App() {
  const [current, setCurrent] = useState<string>('')
  const [displayed, setDisplayed] = useState<string>('')
  const [remaining, setRemaining] = useState<number>(0)
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter')
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [history, setHistory] = useState<string[]>([])

  function readShown(): string[] {
    const raw = getStorage(SHOWN_KEY)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  function pickQuestion(seen: string[]) {
    const pool = QUESTION.filter((q) => !seen.includes(q))
    setRemaining(pool.length - 1)
    if (pool.length === 0) {
      setIsCompleted(true)
      return
    }
    setIsCompleted(false)
    setCurrent(pool[Math.floor(Math.random() * pool.length)])
  }

  function reset() {
    clearStorage(SHOWN_KEY)
    setHistory([])
    setCurrent('')
    setDisplayed('')
    pickQuestion([])
  }

  function handleNext() {
    if (!current) return
    const nextShown = [...readShown(), current]
    setStorage(SHOWN_KEY, JSON.stringify(nextShown))
    setHistory(prev => [...prev, current])
    setDirection('next')
    pickQuestion(nextShown)
  }

  function handlePrev() {
    if (history.length === 0) return
    const previous = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setDirection('prev')
    setCurrent(previous)
    setIsCompleted(false)
  }

  useEffect(() => {
    const shown = readShown()
    if (shown.length === 0) {
      pickQuestion([])
      return
    }
    pickQuestion(shown)
  }, [])

  useEffect(() => {
    if (!current) return
    if (current === displayed) return

    if (displayed === '') {
      setDisplayed(current)
      return
    }

    setPhase('exit')
    const timer = setTimeout(() => {
      setDisplayed(current)
      setPhase('enter')
    }, 250)

    return () => clearTimeout(timer)
  }, [current])

  if (isCompleted) {
    return (
      <section>
        <div className='flex-col-between'>
          <div className='progress'>
            <div className='flex-row-between'>
              <p>0 LEFT</p>
              <p role="button" tabIndex={0} onClick={reset} onKeyDown={(e) => e.key === 'Enter' && reset()}>
                RESET
              </p>
            </div>
            <div className='percentage'>
              <div className='percentage-bar' style={{width: '0%'}}></div>
            </div>
          </div>
          <div className='card'>
            <div className='card-content anim-in'>
              All questions completed!<br />Great job.
            </div>
          </div>
          <div className='flex'>
            <button className="primary" onClick={reset} style={{width: '100%'}}>
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

  const text = current
  const animClass = displayed !== ''
    ? (phase === 'enter' ? 'anim-in' : 'anim-out')
    : 'anim-in'
  const swipeClass = direction === 'next' ? 'swipe-next' : 'swipe-prev'

  return (
    <section>
      <div className='flex-col-between'>
        <div className='progress'>
          <div className='flex-row-between'>
            <p>
              {remaining} LEFT
            </p>
            <p role="button" tabIndex={0} onClick={reset} onKeyDown={(e) => e.key === 'Enter' && reset()}>
              RESET
            </p>
          </div>
          <div className='percentage'>
            <div className='percentage-bar' style={{width: `${(remaining / QUESTION.length) * 100}%`}}></div>
          </div>
        </div>
        <div className='card'>
          <div className={`card-content ${animClass} ${swipeClass}`}>
            {text}
          </div>
        </div>
        <div className='flex'>
          <button className="outline" onClick={handlePrev}>
            prev
          </button>
          <button className="primary" onClick={handleNext}>
            next card
          </button>
        </div>
      </div>
    </section>
  )
}

export default App
