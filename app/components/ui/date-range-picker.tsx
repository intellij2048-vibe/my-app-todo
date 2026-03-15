"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { ko } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string
  date?: DateRange | undefined
  onDateChange?: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date)

  // 상위에서 date가 변경되면 내부 상태도 동기화 (예: 초기화 버튼 등)
  React.useEffect(() => {
    setTempDate(date)
  }, [date])

  const handleApply = () => {
    onDateChange?.(tempDate)
    setIsOpen(false)
  }

  const dateFormat = "yyyy년 MM월 dd일"

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-medium h-12 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm shadow-sm",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-5 w-5 text-indigo-500" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, dateFormat, { locale: ko })} -{" "}
                  {format(date.to, dateFormat, { locale: ko })}
                </>
              ) : (
                format(date.from, dateFormat, { locale: ko })
              )
            ) : (
              <span>기간을 선택하세요</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 rounded-3xl border-none shadow-2xl bg-white/90 backdrop-blur-md" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={tempDate?.from}
            selected={tempDate}
            onSelect={setTempDate}
            numberOfMonths={2}
            locale={ko}
            className="rounded-2xl border-gray-100"
          />
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl px-6"
              onClick={() => {
                setTempDate(date)
                setIsOpen(false)
              }}
            >
              취소
            </Button>
            <Button 
              size="sm" 
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 shadow-lg shadow-indigo-100"
              onClick={handleApply}
            >
              확인
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
