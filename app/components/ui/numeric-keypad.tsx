'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Delete, Check, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NumericKeypadProps {
  onInput: (digit: string) => void
  onDelete: () => void
  onClear?: () => void
  onConfirm?: () => void
  className?: string
}

export function NumericKeypad({
  onInput,
  onDelete,
  onClear,
  onConfirm,
  className
}: NumericKeypadProps) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL']

  return (
    <div className={cn("grid grid-cols-3 gap-3 p-4 bg-gray-50/50 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-inner w-full max-w-[300px]", className)}>
      {keys.map((key) => {
        let content: React.ReactNode = key
        let onClick = () => onInput(key)
        let variant: "outline" | "ghost" | "default" | "secondary" = "outline"
        
        if (key === 'DEL') {
          content = <Delete className="w-5 h-5 text-red-500" />
          onClick = onDelete
        } else if (key === 'C') {
          content = <RotateCcw className="w-5 h-5 text-amber-500" />
          onClick = onClear || (() => {})
        }

        return (
          <Button
            key={key}
            variant={variant}
            onClick={onClick}
            className={cn(
              "h-16 text-xl font-bold rounded-2xl transition-all active:scale-95 active:bg-indigo-50 border-gray-200 shadow-sm bg-white hover:bg-gray-50",
              key === 'DEL' && "hover:bg-red-50",
              key === 'C' && "hover:bg-amber-50"
            )}
          >
            {content}
          </Button>
        )
      })}
      
      {onConfirm && (
        <Button
          onClick={onConfirm}
          className="col-span-3 h-14 mt-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
        >
          <Check className="mr-2 w-6 h-6" /> 확인
        </Button>
      )}
    </div>
  )
}
