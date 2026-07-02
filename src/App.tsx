import './App.css'
import { useState, useEffect } from 'react'
import { QUESTION } from './lib/contants'
import { getCookie, setCookie } from './lib/cookie'

const SHOWN_KEY = 'connects_shown_questions';

function App() {
  const [current, setCurrent] = useState<string>('')
  const [displayed, setDisplayed] = useState<string>('')
  const [remaining, setRemaining] = useState<number>(0)
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter')

  const shownIds: string[] = (() => {
    const raw = getCookie(SHOWN_KEY);
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })()

  const available = QUESTION.filter((q) => !shownIds.includes(q))

  function pickQuestion(seen: string[]) {
    const pool = QUESTION.filter((q) => !seen.includes(q))
    setRemaining(pool.length - 1)
    if (pool.length === 0) {
      setCurrent(QUESTION[Math.floor(Math.random() * QUESTION.length)])
      return
    }
    setCurrent(pool[Math.floor(Math.random() * pool.length)])
  }

  function reset() {
    setCookie(SHOWN_KEY, '[]')
    pickQuestion([])
  }

  function addShown(question: string) {
    const nextShown = [...shownIds, question]
    setCookie(SHOWN_KEY, JSON.stringify(nextShown))
  }

  useEffect(() => {
    if (available.length === 0) {
      setCurrent(QUESTION[Math.floor(Math.random() * QUESTION.length)])
      setRemaining(QUESTION.length - 1)
      return
    }
    pickQuestion(shownIds)
  }, [])

  // Handle enter/exit animation when the question changes
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

  function handleNext() {
    if (!current) return
    addShown(current)
    const nextShown = [...shownIds, current]
    pickQuestion(nextShown)
  }

  if (!displayed && !current) {
    return null
  }

  const text = phase === 'exit' ? displayed : current
  const animClass = displayed !== ''
    ? (phase === 'enter' ? 'anim-in' : 'anim-out')
    : 'anim-in'

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
          <div className={`card-content ${animClass}`}>
            {text}
          </div>
        </div>
        <div className='flex'>
          <button className="outline" onClick={() => addShown(current)}>
            pass
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
