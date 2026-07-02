type ProgressProps = {
  remaining: number
  total: number
  onReset: () => void
}

export function Progress({ remaining, total, onReset }: ProgressProps) {
  const pct = ((total - remaining) / total) * 100

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex justify-between items-center w-full">
        <p className="text-sm font-semibold text-left text-fg">
          {total - remaining} / {total}
        </p>
        <p 
          role="button" 
          tabIndex={0} 
          onClick={onReset}
          onKeyDown={(e) => e.key === 'Enter' && onReset()}
          className="text-sm font-semibold text-left text-fg cursor-pointer"
        >
          RESET
        </p>
      </div>
      <div className="w-full h-3 bg-bg border-2 overflow-hidden">
        <div
          className="h-2.5 bg-primary border-r-2 border-fg transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
