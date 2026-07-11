import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface ContextMenuProps {
  content: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function ContextMenu({ content, children, className }: ContextMenuProps) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    setVisible(true)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div onContextMenu={handleContextMenu} className="relative">
      {children}
      {visible && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: `${position.y}px`,
            left: `${position.x}px`,
          }}
          className={cn(
            'z-[var(--z-index-dropdown)] min-w-[8rem] overflow-hidden rounded-xl border border-[var(--border)] bg-white/95 dark:bg-slate-900/95 p-1 text-[var(--body)] shadow-[var(--shadow-md)] backdrop-blur-md animate-fade-in font-sans',
            className
          )}
        >
          <div onClick={() => setVisible(false)} className="w-full">
            {content}
          </div>
        </div>
      )}
    </div>
  )
}

export default ContextMenu
