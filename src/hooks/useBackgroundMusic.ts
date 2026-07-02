import { useState, useEffect, useCallback, useRef } from 'react'

export function useBackgroundMusic(src = '/background.mp3', initialMuted = false) {
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [muted, setMuted] = useState(initialMuted)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.5
    audio.muted = initialMuted
    audioRef.current = audio

    const handleCanPlay = () => setReady(true)
    const handleError = () => console.error('[ERROR] Failed to load background music:', src)

    audio.addEventListener('canplaythrough', handleCanPlay)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [src, initialMuted])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted
    }
  }, [muted])

  const start = useCallback(() => {
    if (!audioRef.current || !ready) return
    audioRef.current.currentTime = 0
    if (muted) {
      audioRef.current.muted = false
      setMuted(false)
    }
    audioRef.current.play().then(() => {
      setPlaying(true)
    }).catch((err) => console.error('[ERROR] Background music playback failed:', err))
  }, [ready, muted])

  const stop = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setPlaying(false)
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev)
  }, [])

  return { start, stop, playing, ready, muted, toggleMute }
}
