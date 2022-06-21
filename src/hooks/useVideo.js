import { useRef, useState } from "react"

export default function useVideo() {
  const videoRef = useRef()
  const [isPlaying, setPlaying] = useState(false)
  const [isMuted, setMuted] = useState(true)

  const toggleMute = () => setMuted((prev) => !prev)

  function togglePlay(event) {
    event.stopPropagation()
    if (isPlaying) {
      videoRef.current?.pause()
      setPlaying(false)
    } else {
      videoRef.current?.play()
      setPlaying(true)
    }
  }

  return { isMuted, isPlaying, setPlaying, toggleMute, togglePlay, videoRef }
}
