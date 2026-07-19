import { useState, useEffect } from 'react'

interface StreamingTextProps {
  text: string
  speed?: number // speed in ms per word/character
  mode?: 'word' | 'char'
  className?: string
  onComplete?: () => void
}

export function StreamingText({
  text,
  speed = 20,
  mode = 'word',
  className = '',
  onComplete,
}: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedText(text)
      onComplete?.()
      return
    }

    setDisplayedText('')
    
    const tokens = mode === 'word' ? text.split(' ') : text.split('')
    let index = 0

    const timer = setInterval(() => {
      if (index < tokens.length) {
        setDisplayedText((prev) => {
          if (mode === 'word') {
            return prev + (prev ? ' ' : '') + tokens[index]
          } else {
            return prev + tokens[index]
          }
        })
        index++
      } else {
        clearInterval(timer)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed, mode, onComplete])

  const isFinished = displayedText.length >= text.length

  return (
    <span className={className}>
      {displayedText}
      {!isFinished && (
        <span
          className="inline-block w-1.5 h-3.5 bg-primary/80 animate-pulse ml-1.5"
          style={{ verticalAlign: 'middle' }}
        />
      )}
    </span>
  )
}

export default StreamingText
