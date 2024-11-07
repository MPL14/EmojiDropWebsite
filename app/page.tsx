'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import Image from 'next/image'

const emojis = ['😀', '😂', '🥳', '😎', '🤩', '🥰', '🤯', '🤓', '🤪', '😜']

const EmojiAnimation = ({ emoji }: { emoji: string }) => {
  const controls = useAnimationControls()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const animate = async () => {
      const startX = Math.random() * 100
      const duration = 5 + Math.random() * 5
      const bounceHeight = 100 + Math.random() * 200

      await controls.start({
        x: [
          `${startX}vw`,
          `${(startX + (Math.random() - 0.5) * 20 + 100) % 100}vw`,
          `${(startX + (Math.random() - 0.5) * 40 + 100) % 100}vw`,
        ],
        y: [
          '-20vh',
          `${bounceHeight}vh`,
          `${bounceHeight - 50}vh`,
          `${bounceHeight}vh`,
          `${bounceHeight - 25}vh`,
          `${bounceHeight}vh`,
        ],
        transition: {
          duration: duration,
          times: [0, 0.4, 0.6, 0.8, 0.9, 1],
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
        },
      })
    }

    animate()
  }, [controls])

  return (
    <motion.div
      ref={containerRef}
      animate={controls}
      className="absolute text-6xl pointer-events-none select-none"
      style={{ left: 0, top: 0 }}
    >
      {emoji}
    </motion.div>
  )
}

const FallingEmoji = ({ x, y }: { x: number; y: number }) => {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)]
  const fallDistance = Math.random() * 300 + 200
  const horizontalMovement = (Math.random() - 0.5) * 200

  return (
    <motion.div
      className="absolute text-4xl pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ 
        x: horizontalMovement, 
        y: fallDistance, 
        opacity: 0, 
        scale: 0.5,
        rotate: Math.random() * 360
      }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      {emoji}
    </motion.div>
  )
}

export default function LandingPage() {
  const [fallingEmojis, setFallingEmojis] = useState<{ x: number; y: number; id: number }[]>([])
  const [isMouseDown, setIsMouseDown] = useState(false)

  const createEmojis = useCallback((x: number, y: number) => {
    const newEmojiId = Date.now()
    
    const newFallingEmojis = Array.from({ length: 10 }, (_, index) => ({
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 50,
      id: newEmojiId + index,
    }))
    setFallingEmojis((prevEmojis) => [...prevEmojis, ...newFallingEmojis])

    setTimeout(() => {
      setFallingEmojis((prevEmojis) => prevEmojis.filter((emoji) => emoji.id < newEmojiId || emoji.id >= newEmojiId + 10))
    }, 1500)
  }, [])

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseDown(true)
    createEmojis(event.clientX, event.clientY)
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMouseDown) {
      createEmojis(event.clientX, event.clientY)
    }
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div 
      className="relative min-h-screen bg-black text-white overflow-hidden cursor-pointer select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0">
        {emojis.map((emoji, index) => (
          <EmojiAnimation key={index} emoji={emoji} />
        ))}
      </div>
      {fallingEmojis.map((emoji) => (
        <FallingEmoji key={emoji.id} x={emoji.x} y={emoji.y} />
      ))}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="flex flex-col items-center justify-center space-y-8">
          <Image
            src="/Shapefall.png"
            alt="Emoji Drop Logo"
            width={124}
            height={124}
            className="select-none"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-center select-none">
            Emoji Drop
          </h1>
          <a
            href="https://apps.apple.com/us/app/emoji-drop-game/id6737870550?platform=iphone"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[120px] h-[40px] transition-opacity hover:opacity-80"
          >
            <Image
              src="/app-store-badge.svg"
              alt="Download on the App Store"
              width={120}
              height={40}
              className="select-none"
            />
          </a>
        </div>
      </div>
    </div>
  )
}