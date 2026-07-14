import { useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getItem, setItem } from '../lib/storage'
import { QUESTIONS, CHALLENGES } from '../lib/constants'
import { useClickSound } from '../hooks/useClickSound'
import { useBackgroundMusic } from '../hooks/useBackgroundMusic'
import { VolumeButton } from '../components/VolumeButton'

const NAMES_KEY = 'spin_game_names'

function loadNames(): string[] {
  const raw = getItem(NAMES_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveNames(names: string[]) {
  setItem(NAMES_KEY, JSON.stringify(names))
}

type SpinResult = { type: 'truth'; text: string } | { type: 'dare'; title: string; text: string } | null

export function SpinGame() {
  const [names, setNames] = useState<string[]>(loadNames)
  const [inputValue, setInputValue] = useState('')
  const [displayedName, setDisplayedName] = useState<string | null>(null)
  const [displayedType, setDisplayedType] = useState<'truth' | 'dare' | null>(null)
  const [result, setResult] = useState<SpinResult>(null)
  const [spinning, setSpinning] = useState(false)
  const [spinPhase, setSpinPhase] = useState<'idle' | 'spinning-name' | 'picking-type' | 'spinning-type' | 'done'>('idle')
  const [mode, setMode] = useState<'online' | 'offline'>('online')
  const { muted, toggleMute } = useBackgroundMusic('/background.mp3', true)
  const { playClick: playSelect } = useClickSound('/select.mp3', muted)
  const timersRef = useRef<number[]>([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  const addName = () => {
    const trimmed = inputValue.trim()
    if (!trimmed || names.includes(trimmed)) return
    const updated = [...names, trimmed]
    setNames(updated)
    saveNames(updated)
    setInputValue('')
  }

  const removeName = (name: string) => {
    const updated = names.filter((n) => n !== name)
    setNames(updated)
    saveNames(updated)
  }

  const pickRandomName = useCallback(() => {
    return names[Math.floor(Math.random() * names.length)]
  }, [names])

  const pickRandomType = (): 'truth' | 'dare' => {
    return Math.random() < 0.5 ? 'truth' : 'dare'
  }

  const pickTruth = (): string => {
    const allQuestions = Object.values(QUESTIONS).flat()
    return allQuestions[Math.floor(Math.random() * allQuestions.length)]
  }

  const pickDare = (): { title: string; text: string } => {
    const allChallenges = Object.values(CHALLENGES).flat()
    const challenge = allChallenges[Math.floor(Math.random() * allChallenges.length)]
    return {
      title: challenge.title,
      text: mode === 'online' ? challenge.online : challenge.offline,
    }
  }

  const spinWheel = (
    items: string[],
    onTick: (item: string) => void,
    totalTicks: number,
    baseDelay: number,
    finalItem: string
  ): Promise<void> => {
    return new Promise((resolve) => {
      let count = 0
      const tick = () => {
        onTick(items[Math.floor(Math.random() * items.length)])
        count++
        if (count >= totalTicks) {
          onTick(finalItem)
          resolve()
          return
        }
        const progress = count / totalTicks
        const delay = baseDelay + progress * progress * 200
        const id = window.setTimeout(tick, delay)
        timersRef.current.push(id)
      }
      tick()
    })
  }

  const handleSpin = async () => {
    if (names.length < 2 || spinning) return

    clearTimers()
    setSpinning(true)
    setSpinPhase('spinning-name')
    setResult(null)
    setDisplayedType(null)

    const finalName = pickRandomName()
    await spinWheel(names, setDisplayedName, 15, 50, finalName)
    setSpinPhase('spinning-type')

    const types = ['truth', 'dare']
    const finalType = pickRandomType()
    await spinWheel(types, (t) => setDisplayedType(t as 'truth' | 'dare'), 10, 60, finalType)
    playSelect()

    if (finalType === 'truth') {
      setResult({ type: 'truth', text: pickTruth() })
    } else {
      const dare = pickDare()
      setResult({ type: 'dare', title: dare.title, text: dare.text })
    }

    setSpinPhase('done')
    setSpinning(false)
  }

  const handleReset = () => {
    clearTimers()
    setDisplayedName(null)
    setDisplayedType(null)
    setResult(null)
    setSpinPhase('idle')
  }

  const isIdle = spinPhase === 'idle' || spinPhase === 'done'

  return (
    <section className="w-full h-full">
      <div className="h-full flex flex-col justify-between gap-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-sm font-bold border-3 border-fg px-3 py-1 shadow-[3px_3px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Home
          </Link>
          <h1 className="text-xl font-bold">Spin & Dare</h1>
          <VolumeButton muted={muted} onToggle={toggleMute} />
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {isIdle && spinPhase !== 'done' && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addName()}
                  placeholder="Add name..."
                  className="flex-1 border-3 border-fg px-3 py-2 bg-bg text-fg placeholder:text-fg/40 focus:outline-none"
                />
                <button
                  onClick={addName}
                  className="bg-primary px-4 py-2 font-bold border-3 border-fg shadow-[3px_3px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Add
                </button>
              </div>

              {names.length > 0 && (
                <>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode('online')}
                    className={`flex-1 px-3 py-1 text-sm font-bold uppercase border-3 border-fg transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none ${
                      mode === 'online'
                        ? 'bg-primary shadow-[3px_3px_0_0_#000]'
                        : 'bg-bg shadow-none'
                    }`}
                  >
                    Online
                  </button>
                  <button
                    onClick={() => setMode('offline')}
                    className={`flex-1 px-3 py-1 text-sm font-bold uppercase border-3 border-fg transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none ${
                      mode === 'offline'
                        ? 'bg-primary shadow-[3px_3px_0_0_#000]'
                        : 'bg-bg shadow-none'
                    }`}
                  >
                    Offline
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {names.map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 border-3 border-fg px-3 py-1 bg-bg text-sm"
                    >
                      {name}
                      <button
                        onClick={() => removeName(name)}
                        className="text-fg/60 hover:text-fg font-bold"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                </>
              )}
            </>
          )}

          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {names.length < 2 && spinPhase === 'idle' ? (
              <p className="text-fg/60 text-center">Add at least 2 names to play</p>
            ) : spinPhase === 'done' && result ? (
              <div className="w-full flex flex-col items-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-fg/60 mb-1">Selected</p>
                  <p className="text-3xl font-bold">{displayedName}</p>
                </div>
                <div
                  className={`w-full border-3 border-fg shadow-[5px_5px_0_0_#000] p-6 animate-[slideIn_0.3s_ease] ${
                    result.type === 'truth' ? 'bg-primary' : 'bg-[#fabd2f]'
                  }`}
                >
                  <p className="font-bold text-lg uppercase mb-3 text-center">
                    {result.type === 'truth' ? 'Truth' : 'Dare'}
                  </p>
                  {result.type === 'dare' && (
                    <p className="font-bold text-center mb-2">{result.title}</p>
                  )}
                  <p className="text-center">{result.text}</p>
                </div>
                
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                {displayedName && (
                  <div
                    className="w-full text-center"
                  >
                    <p className="text-sm text-fg/60 mb-1">Who</p>
                    <p className="text-4xl font-bold">{displayedName}</p>
                  </div>
                )}
                {displayedType && (
                  <div
                    className={`w-full text-center ${displayedType === 'truth' ? 'text-primary' : 'text-[#fabd2f]'}`}
                  >
                    <p className="text-sm text-fg/60 mb-1">What</p>
                    <p className="text-5xl font-bold uppercase">{displayedType}</p>
                  </div>
                )}
                {!displayedName && !displayedType && (
                  <div className="text-fg/40 text-center">
                    <p className="text-6xl mb-4">?</p>
                    <p>Ready to spin</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          {spinPhase === 'done' && (
            <button
              onClick={handleReset}
              className="bg-bg px-4 py-3 font-bold text-black uppercase border-3 border-fg shadow-[5px_5px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Reset
            </button>
          )}
          <button
            onClick={handleSpin}
            disabled={names.length < 2 || spinning}
            className={`flex-1 px-6 py-3 font-bold text-black uppercase shadow-[5px_5px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[5px_5px_0_0_#000] ${
              spinning
                ? 'bg-primary animate-pulse'
                : 'bg-primary'
            }`}
          >
            {spinning ? 'Spinning...' : 'Spin'}
          </button>
        </div>
      </div>
    </section>
  )
}
