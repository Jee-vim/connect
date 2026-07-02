import { QUESTIONS } from '../lib/constants'

type ProgressProps = {
  remaining: number
  onReset: () => void
}

export function Progress({ remaining, onReset }: ProgressProps) {
  const pct = (remaining / QUESTIONS.length) * 100

  return (
    <div>
      <div className="flex justify-between gap-8">
        <p className="font-semibold text-sm text-left">{remaining} LEFT</p>
        <p
          role="button"
          tabIndex={0}
          onClick={onReset}
          onKeyDown={(e) => e.key === 'Enter' && onReset()}
          className="font-semibold text-sm text-left cursor-pointer"
        >
          RESET
        </p>
      </div>
      <div className="w-full overflow-hidden border-2 border-fg bg-bg">
        <div
          className="h-2.5 bg-primary border-r-2 border-fg"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
