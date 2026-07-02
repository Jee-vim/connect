import { useRef, useCallback, useEffect, useState } from 'react'

export function useClickSound(src = '/click.mp3', muted = false) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const audio = new Audio(src)
    audio.preload = 'auto'
    audio.muted = muted
    audioRef.current = audio

    const handleCanPlay = () => setReady(true)
    const handleError = () => console.error('[ERROR] Failed to load click sound:', src)

    audio.addEventListener('canplaythrough', handleCanPlay)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [src])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted
    }
  }, [muted])

  const play = useCallback(() => {
    if (!audioRef.current || !ready) return
    const audio = audioRef.current
    audio.currentTime = 0
    audio.play().catch((err) => console.error('[ERROR] Click sound playback failed:', err))
  }, [ready])

  return { playClick: play, ready }
}
