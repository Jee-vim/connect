import type { Phase, Direction } from '../types'

type CardProps = {
  text: string
  phase: Phase
  direction: Direction
}

function animClass(phase: Phase, direction: Direction): string {
  const base = phase === 'enter' ? 'anim-in' : 'anim-out'
  const swipe = direction === 'next' ? 'swipe-next' : 'swipe-prev'
  return `${base} ${swipe} w-full min-w-0 break-words`
}

export function Card({ text, phase, direction }: CardProps) {
  return (
    <div className="flex items-center justify-center px-6 py-3 h-[70vh] font-bold text-center text-[var(--color-fg)] text-2xl border-3 border-fg shadow-[5px_5px_0_0_#000] overflow-hidden">
      <div className={animClass(phase, direction)}>{text}</div>
    </div>
  )
}
