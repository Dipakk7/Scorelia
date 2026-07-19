import React from 'react'

export function BackgroundMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-10] opacity-10 dark:opacity-15 select-none" aria-hidden="true">
      {/* Blob 1: Top Left - Indigo */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full blur-[110px] -left-48 -top-48 bg-mesh-blob-1" 
        style={{ backgroundColor: 'var(--blob-1)' }}
      />
      {/* Blob 2: Bottom Right - Pink */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] -right-32 -bottom-32 bg-mesh-blob-2" 
        style={{ backgroundColor: 'var(--blob-2)' }}
      />
      {/* Blob 3: Center/Middle - Teal */}
      <div 
        className="absolute w-[350px] h-[350px] rounded-full blur-[90px] left-1/3 top-1/4 bg-mesh-blob-3" 
        style={{ backgroundColor: 'var(--blob-3)' }}
      />
    </div>
  )
}

export default BackgroundMesh
