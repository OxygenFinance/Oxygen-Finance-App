"use client"

import { useState, useRef, useEffect } from "react"

interface VideoPlayerProps {
  src: string
  poster?: string
  isLocked?: boolean
}

export function VideoPlayer({ src, poster, isLocked = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("volumechange", handleVolumeChange)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("volumechange", handleVolumeChange)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    const container = document.getElementById("video-container")
    container?.addEventListener("mousemove", handleMouseMove)

    return () => {
      container?.removeEventListener("mousemove", handleMouseMove)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const video = videoRef.current
    if (!video) return

    const volumeValue = newVolume[0]
    video.volume = volumeValue

    if (volumeValue === 0) {
      video.muted = true
    } else if (video.muted) {
      video.muted = false
    }
  }

  const handleSeek = (newTime: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = newTime[0]
  }

  const toggleFullscreen = () => {
    const container = document.getElementById("video-container")
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div
      id="video-container"
      className="relative w-full bg-black rounded-lg overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {isLocked ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="text-white text-center p-4">
            <h3
\
Let's update the WalletManager component to use the real database:
