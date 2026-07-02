import type { Phase, Direction } from '../types'

type CardProps = {
  text: string
  phase: Phase
  direction: Direction
  currentIndex?: number
  total?: number
}

function animClass(phase: Phase, direction: Direction): string {
  const base = phase === 'enter' ? 'anim-in' : 'anim-out'
  const swipe = direction === 'next' ? 'swipe-next' : 'swipe-prev'
  return `${base} ${swipe} w-full min-w-0 break-words`
}

export function Card({ text, phase, direction, currentIndex, total }: CardProps) {
  return (
    <div className="relative flex items-center justify-center px-4 py-6 h-[65vh] font-bold text-center text-[var(--color-fg)] text-xl sm:text-2xl border-3 border-fg shadow-[5px_5px_0_0_#000] overflow-hidden rounded-lg bg-bg">
      <div className={animClass(phase, direction)}>
        {text}
      </div>
      {currentIndex !== undefined && total !== undefined && (
        <div className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-primary text-black rounded">
          {currentIndex} / {total}
        </div>
      )}
    </div>
  )
}
