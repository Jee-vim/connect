import { type ReactNode } from 'react'

type StartPopupProps = {
  onStart: () => void
  title?: ReactNode
  description?: ReactNode
}

export function StartPopup({ onStart, title, description }: StartPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 border-3 border-fg shadow-[5px_5px_0_0_#000] bg-bg p-8 text-center">
        {title ? (
          <h1 className="text-2xl font-bold text-fg mb-4">{title}</h1>
        ) : null}
        {description ? (
          <p className="text-lg text-fg mb-8">{description}</p>
        ) : null}
        <button
          onClick={onStart}
          className="w-full bg-primary px-6 py-3 font-bold text-black uppercase shadow-[5px_5px_0_0_#000] transition-all duration-100 ease-in active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Start
        </button>
      </div>
    </div>
  )
}
