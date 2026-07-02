import './App.css'
import { useState, useEffect } from 'react'
import { QUESTION } from './lib/contants'
import { getCookie, setCookie } from './lib/cookie'
const SHOWN_KEY = 'connects_shown_questions';
function App() {
  const [current, setCurrent] = useState<string>('')
  const [remaining, setRemaining] = useState<number>(0)
  function reset() {
    setCookie(SHOWN_KEY, '[]')
    pickRandom()
  }
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
  function pickRandom() {
    const pool = QUESTION.filter((q) => !shownIds.includes(q))
    if (pool.length === 0) {
      setCookie(SHOWN_KEY, '[]')
      setCurrent(QUESTION[Math.floor(Math.random() * QUESTION.length)])
      setRemaining(QUESTION.length - 1)
      return
    }
    const next = pool[Math.floor(Math.random() * pool.length)]
    setCurrent(next)
    setRemaining(pool.length - 1)
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
    setCurrent(available[Math.floor(Math.random() * available.length)])
    setRemaining(available.length - 1)
  }, [])
  function handleNext() {
    if (!current) return
    addShown(current)
    pickRandom()
  }
  if (!current) {
    return null
  }
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
          {current}
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
