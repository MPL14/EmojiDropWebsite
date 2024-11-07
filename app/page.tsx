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
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <Image
            src="/Shapefall.png"
            alt="Emoji Drop Logo"
            width={124}
            height={124}
            className="select-none"
          />
          <h1 className="text-5xl md:text-6xl font-bold select-none">
            Emoji Drop
          </h1>
          <a
            href="https://apps.apple.com/us/app/emoji-drop-game/id6737870550?platform=iphone"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[200px] flex justify-center"
          >
            <svg id="livetype" xmlns="http://www.w3.org/2000/svg" width="119.66407" height="40" viewBox="0 0 119.66407 40">
              <title>Download_on_the_App_Store_Badge_US-UK_RGB_blk_4SVG_092917</title>
              <g>
                <g>
                  <g>
                    <path d="M110.13477,0H9.53468c-.3667,0-.729,0-1.09473.002-.30615.002-.60986.00781-.91895.0127A13.21476,13.21476,0,0,0,5.5171.19141a6.66509,6.66509,0,0,0-1.90088.627A6.43779,6.43779,0,0,0,1.99757,1.99707,6.25844,6.25844,0,0,0,.81935,3.61816a6.60119,6.60119,0,0,0-.625,1.90332,12.993,12.993,0,0,0-.1792,2.002C.00587,7.83008.00489,8.1377,0,8.44434V31.5586c.00489.3105.00587.6113.01515.9219a12.99232,12.99232,0,0,0,.1792,2.0019,6.58756,6.58756,0,0,0,.625,1.9043A6.20778,6.20778,0,0,0,1.99757,38.001a6.27445,6.27445,0,0,0,1.61865,1.1787,6.70082,6.70082,0,0,0,1.90088.6308,13.45514,13.45514,0,0,0,2.0039.1768c.30909.0068.6128.0107.91895.0107C8.80567,40,9.168,40,9.53468,40H110.13477c.3594,0,.7246,0,1.084-.002.3047,0,.6172-.0039.9219-.0107a13.279,13.279,0,0,0,2-.1768,6.80432,6.80432,0,0,0,1.9082-.6308,6.27742,6.27742,0,0,0,1.6172-1.1787,6.39482,6.39482,0,0,0,1.1816-1.6143,6.60413,6.60413,0,0,0,.6191-1.9043,13.50643,13.50643,0,0,0,.1856-2.0019c.0039-.3106.0039-.6114.0039-.9219.0078-.3633.0078-.7246.0078-1.0938V9.53613c0-.36621,0-.72949-.0078-1.09179,0-.30664,0-.61426-.0039-.9209a13.5071,13.5071,0,0,0-.1856-2.002,6.6177,6.6177,0,0,0-.6191-1.90332,6.46619,6.46619,0,0,0-2.7988-2.7998,6.76754,6.76754,0,0,0-1.9082-.627,13.04394,13.04394,0,0,0-2-.17676c-.3047-.00488-.6172-.01074-.9219-.01269-.3594-.002-.7246-.002-1.084-.002Z" style={{fill: '#a6a6a6'}}/>
                    <path d="M8.44483,39.125c-.30468,0-.602-.0039-.90429-.0107a12.68714,12.68714,0,0,1-1.86914-.1631,5.88381,5.88381,0,0,1-1.65674-.5479,5.40573,5.40573,0,0,1-1.397-1.0166,5.32082,5.32082,0,0,1-1.02051-1.3965,5.72186,5.72186,0,0,1-.543-1.6572,12.41351,12.41351,0,0,1-.1665-1.875c-.00634-.2109-.01464-.9131-.01464-.9131V8.44434S.88185,7.75293.8877,7.5498a12.37039,12.37039,0,0,1,.16553-1.87207,5.7555,5.7555,0,0,1,.54346-1.6621A5.37349,5.37349,0,0,1,2.61183,2.61768,5.56543,5.56543,0,0,1,4.01417,1.59521a5.82309,5.82309,0,0,1,1.65332-.54394A12.58589,12.58589,0,0,1,7.543.88721L8.44532.875H111.21387l.9131.0127a12.38493,12.38493,0,0,1,1.8584.16259,5.93833,5.93833,0,0,1,1.6709.54785,5.59374,5.59374,0,0,1,2.415,2.41993,5.76267,5.76267,0,0,1,.5352,1.64892,12.995,12.995,0,0,1,.1738,1.88721c.0029.2832.0029.5874.0029.89014.0079.375.0079.73193.0079,1.09179V30.4648c0,.3633,0,.7178-.0079,1.0752,0,.3252,0,.6231-.0039.9297a12.73126,12.73126,0,0,1-.1709,1.8535,5.739,5.739,0,0,1-.54,1.67,5.48029,5.48029,0,0,1-1.0156,1.3857,5.4129,5.4129,0,0,1-1.3994,1.0225,5.86168,5.86168,0,0,1-1.668.5498,12.54218,12.54218,0,0,1-1.8692.1631c-.2929.0068-.5996.0107-.8974.0107l-1.084.002Z"/>
                  </g>
                  <g id="_Group_" data-name="&lt;Group&gt;">
                    <g id="_Group_2" data-name="&lt;Group&gt;">
                      <g id="_Group_3" data-name="&lt;Group&gt;">
                        <path id="_Path_" data-name="&lt;Path&gt;" d="M24.76888,20.30068a4.94881,4.94881,0,0,1,2.35656-4.15206,5.06566,5.06566,0,0,0-3.99116-2.15768c-1.67924-.17626-3.30719,1.00483-4.1629,1.00483-.87227,0-2.18977-.98733-3.6085-.95814a5.31529,5.31529,0,0,0-4.47292,2.72787c-1.934,3.34842-.49141,8.26947,1.3612,10.97608.9269,1.32535,2.01018,2.8058,3.42763,2.7533,1.38706-.05753,1.9051-.88448,3.5794-.88448,1.65876,0,2.14479.88448,3.591.8511,1.48838-.02416,2.42613-1.33124,3.32051-2.66914a10.962,10.962,0,0,0,1.51842-3.09251A4.78205,4.78205,0,0,1,24.76888,20.30068Z" style={{fill: '#fff'}}/>
                        <path id="_Path_2" data-name="&lt;Path&gt;" d="M22.03725,12.21089a4.87248,4.87248,0,0,0,1.11452-3.49062,4.95746,4.95746,0,0,0-3.20758,1.65961,4.63634,4.63634,0,0,0-1.14371,3.36139A4.09905,4.09905,0,0,0,22.03725,12.21089Z" style={{fill: '#fff'}}/>
                      </g>
                    </g>
                    <g>
                      <path d="M42.30227,27.13965h-4.7334l-1.13672,3.35645H34.42727l4.4834-12.418h2.083l4.4834,12.418H43.438ZM38.0591,25.59082h3.752l-1.84961-5.44727h-.05176Z" style={{fill: '#fff'}}/>
                      <path d="M55.15969,25.96973c0,2.81348-1.50586,4.62109-3.77832,4.62109a3.0693,3.0693,0,0,1-2.84863-1.584h-.043v4.48438h-1.8584V21.44238H48.4302v1.50586h.03418a3.21162,3.21162,0,0,1,2.88281-1.60059C53.645,21.34766,55.15969,23.16406,55.15969,25.96973Zm-1.91016,0c0-1.833-.94727-3.03809-2.39258-3.03809-1.41992,0-2.375,1.23047-2.375,3.03809,0,1.82422.95508,3.0459,2.375,3.0459C52.30227,29.01563,53.24953,27.81934,53.24953,25.96973Z" style={{fill: '#fff'}}/>
                      <path d="M65.12453,25.96973c0,2.81348-1.50586,4.62109-3.77832,4.62109a3.0693,3.0693,0,0,1-2.84863-1.584h-.043v4.48438h-1.8584V21.44238H58.395v1.50586h.03418A3.21162,3.21162,0,0,1,61.312,21.34766C63.60988,21.34766,65.12453,23.16406,65.12453,25.96973Zm-1.91016,0c0-1.833-.94727-3.03809-2.39258-3.03809-1.41992,0-2.375,1.23047-2.375,3.03809,0,1.82422.95508,3.0459,2.375,3.0459C62.26711,29.01563,63.21438,27.81934,63.21438,25.96973Z" style={{fill: '#fff'}}/>
                      <path d="M71.71047,27.03613c.1377,1.23145,1.334,2.04,2.96875,2.04,1.56641,0,2.69336-.80859,2.69336-1.91895,0-.96387-.67969-1.541-2.28906-1.93652l-1.60937-.3877c-2.28027-.55078-3.33887-1.61719-3.33887-3.34766,0-2.14258,1.86719-3.61426,4.51855-3.61426,2.624,0,4.42285,1.47168,4.4834,3.61426h-1.876c-.1123-1.23926-1.13672-1.9873-2.63379-1.9873s-2.52148.75684-2.52148,1.8584c0,.87793.6543,1.39453,2.25488,1.79l1.36816.33594c2.54785.60254,3.60645,1.626,3.60645,3.44238,0,2.32324-1.85059,3.77832-4.79395,3.77832-2.75391,0-4.61328-1.4209-4.7334-3.667Z" style={{fill: '#fff'}}/>
                      <path d="M83.34621,19.2998v2.14258h1.72168v1.47168H83.34621v4.99121c0,.77539.34473,1.13672,1.10156,1.13672a5.80752,5.80752,0,0,0,.61133-.043v1.46289a5.10351,5.10351,0,0,1-1.03223.08594c-1.833,0-2.54785-.68848-2.54785-2.44434V22.91406H80.16262V21.44238H81.479V19.2998Z" style={{fill: '#fff'}}/>
                      <path d="M86.065,25.96973c0-2.84863,1.67773-4.63867,4.29395-4.63867,2.625,0,4.29492,1.79,4.29492,4.63867,0,2.85645-1.66113,4.63867-4.29492,4.63867C87.72609,30.6084,86.065,28.82617,86.065,25.96973Zm6.69531,0c0-1.9541-.89551-3.10742-2.40137-3.10742s-2.40039,1.16211-2.40039,3.10742c0,1.96191.89453,3.10645,2.40039,3.10645S92.76027,27.93164,92.76027,25.96973Z" style={{fill: '#fff'}}/>
                      <path d="M96.18606,21.44238h1.77246v1.541h.043a2.1594,2.1594,0,0,1,2.17773-1.63574,2.86616,2.86616,0,0,1,.63672.06934v1.73828a2.59794,2.59794,0,0,0-.835-.1123,1.87264,1.87264,0,0,0-1.93652,2.083v5.37012h-1.8584Z" style={{fill: '#fff'}}/>
                      <path d="M109.3843,27.83691c-.25,1.64355-1.85059,2.77148-3.89844,2.77148-2.63379,0-4.26855-1.76465-4.26855-4.5957,0-2.83984,1.64355-4.68164,4.19043-4.68164,2.50488,0,4.08008,1.7207,4.08008,4.46582v.63672h-6.39453v.1123a2.358,2.358,0,0,0,2.43555,2.56445,2.04834,2.04834,0,0,0,2.09082-1.27344Zm-6.28223-2.70215h4.52637a2.1773,2.1773,0,0,0-2.2207-2.29785A2.292,2.292,0,0,0,103.10207,25.13477Z" style={{fill: '#fff'}}/>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
