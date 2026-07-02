import { useState, useEffect, useCallback } from 'react'
import { QUESTIONS } from '../lib/constants'
import { getItem, setItem, removeItem } from '../lib/storage'
import type { Phase, Direction } from '../types'

const STORAGE_KEY = 'connects_shown_questions'

function readShown(): string[] {
  const raw = getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useQuestions() {
  const [current, setCurrent] = useState<string>('')
  const [displayed, setDisplayed] = useState<string>('')
  const [remaining, setRemaining] = useState<number>(0)
  const [phase, setPhase] = useState<Phase>('enter')
  const [direction, setDirection] = useState<Direction>('next')
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [history, setHistory] = useState<string[]>([])

  const pickQuestion = useCallback((seen: string[]) => {
    const pool = QUESTIONS.filter((q) => !seen.includes(q))
    setRemaining(Math.max(0, pool.length - 1))
    if (pool.length === 0) {
      setIsCompleted(true)
      return
    }
    setIsCompleted(false)
    setCurrent(pool[Math.floor(Math.random() * pool.length)])
  }, [])

  const reset = useCallback(() => {
    removeItem(STORAGE_KEY)
    setHistory([])
    setCurrent('')
    setDisplayed('')
    pickQuestion([])
  }, [pickQuestion])

  const handleNext = useCallback(() => {
    if (!current) return
    const nextShown = [...readShown(), current]
    setItem(STORAGE_KEY, JSON.stringify(nextShown))
    setHistory((prev) => [...prev, current])
    setDirection('next')
    pickQuestion(nextShown)
  }, [current, pickQuestion])

  const handlePrev = useCallback(() => {
    if (history.length === 0) return
    const previous = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setDirection('prev')
    setCurrent(previous)
    setIsCompleted(false)
  }, [history])

  useEffect(() => {
    const shown = readShown()
    if (shown.length === 0) {
      pickQuestion([])
      return
    }
    pickQuestion(shown)
  }, [pickQuestion])

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
  }, [current, displayed])

  return {
    current,
    displayed,
    remaining,
    phase,
    direction,
    isCompleted,
    handleNext,
    handlePrev,
    reset,
  }
}
