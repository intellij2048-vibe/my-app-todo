'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export function LoadingOverlay({ isVisible, message = '처리 중...' }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-2xl border border-gray-100">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
        </div>
        
        {/* Progressing Bar Animation */}
        <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-indigo-600 animate-progress origin-left" />
        </div>

        <p className="text-sm font-bold text-gray-700 animate-pulse">{message}</p>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
