type VolumeButtonProps = {
  muted: boolean
  onToggle: () => void
}

export function VolumeButton({ muted, onToggle }: VolumeButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="uppercase outline-none flex items-center justify-center text-sm"
      aria-label={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? (
        "Muted"
      ) : (
      "Sound"
      )}
    </button>
  )
}
