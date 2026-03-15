'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar as CalendarIcon, MoreVertical, Plus, Trash, Check, BarChart, FileText, LayoutDashboard, Settings } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as ReBarChart, Bar } from 'recharts'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'
import { NumericKeypad } from '@/components/ui/numeric-keypad'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { addDays } from 'date-fns'

// Form Schema
const formSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  date: z.date(),
})

const chartData = [
  { name: '월', tasks: 4 },
  { name: '화', tasks: 3 },
  { name: '수', tasks: 7 },
  { name: '목', tasks: 5 },
  { name: '금', tasks: 6 },
  { name: '토', tasks: 2 },
  { name: '일', tasks: 3 },
]

const tableData = [
  { id: 1, task: 'Fix navigation bug', priority: 'High', status: 'Completed' },
  { id: 2, task: 'Implement authentication', priority: 'Medium', status: 'In Progress' },
  { id: 3, task: 'Add dark mode support', priority: 'Low', status: 'To Do' },
  { id: 4, task: 'Update documentation', priority: 'Medium', status: 'To Do' },
]

export default function UISamplesPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState([
    { id: '1', title: '프로젝트 킥오프', start: new Date().toISOString().split('T')[0], description: '팀원들과 첫 미팅 및 방향 설정' },
    { id: '2', title: '클라이언트 미팅', start: new Date(Date.now() + 86400000).toISOString().split('T')[0], description: '요구사항 수렴 및 일정 조율' }
  ])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newStartTime, setNewStartTime] = useState('09:00')
  const [newEndTime, setNewEndTime] = useState('18:00')
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [keypadValue, setKeypadValue] = useState('')
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  // Numeric Keypad Handlers
  const handleKeypadInput = (digit: string) => {
    if (keypadValue.length < 10) {
      setKeypadValue(prev => prev + digit)
    }
  }
  const handleKeypadDelete = () => setKeypadValue(prev => prev.slice(0, -1))
  const handleKeypadClear = () => setKeypadValue('')
  const handleKeypadConfirm = () => {
    toast.success('입력 완료', { description: `입력된 값: ${keypadValue}` })
    setKeypadValue('')
  }

  // React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success('Form submitted successfully!', {
      description: JSON.stringify(values, null, 2),
    })
  }

  // 1. 셀 클릭 또는 드래그 시 (등록 모드)
  const handleSelect = (arg: { startStr: string, endStr: string }) => {
    const datePart = arg.startStr.split('T')[0]
    const startT = arg.startStr.includes('T') ? arg.startStr.split('T')[1].substring(0, 5) : '09:00'
    const endT = arg.endStr.includes('T') ? arg.endStr.split('T')[1].substring(0, 5) : '18:00'
    
    setSelectedDate(datePart)
    setNewStartTime(startT)
    setNewEndTime(endT)
    setEditingEventId(null)
    setNewTitle('')
    setNewDescription('')
    setIsAddDialogOpen(true)
  }

  // 2. 기존 일정 클릭 시 (수정 모드)
  const handleEventClick = (arg: { event: any }) => {
    const event = arg.event
    setEditingEventId(event.id)
    setNewTitle(event.title)
    setNewDescription(event.extendedProps.description || '')
    
    const datePart = event.startStr.split('T')[0]
    const startT = event.startStr.includes('T') ? event.startStr.split('T')[1].substring(0, 5) : '09:00'
    const endT = event.endStr ? (event.endStr.includes('T') ? event.endStr.split('T')[1].substring(0, 5) : '18:00') : '18:00'
    
    setSelectedDate(datePart)
    setNewStartTime(startT)
    setNewEndTime(endT)
    setIsAddDialogOpen(true)
  }

  // 3. 일정 저장/수정 실행
  const handleSaveEvent = () => {
    if (!newTitle.trim()) {
      toast.error('일정 제목을 입력해주세요.')
      return
    }
    
    const startISO = `${selectedDate}T${newStartTime}:00`
    const endISO = `${selectedDate}T${newEndTime}:00`

    if (editingEventId) {
      // 수정 모드
      setEvents(events.map(ev => 
        ev.id === editingEventId 
          ? { ...ev, title: newTitle, description: newDescription, start: startISO, end: endISO } 
          : ev
      ))
      toast.success('일정이 수정되었습니다.')
    } else {
      // 신규 등록 모드
      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTitle,
        start: startISO,
        end: endISO,
        description: newDescription,
      }
      setEvents([...events, newEvent])
      toast.success('새 일정이 등록되었습니다.')
    }
    
    setIsAddDialogOpen(false)
  }

  // 선택된 날짜/시간을 읽기 좋게 포맷팅하는 함수
  const formatSelectedDateTime = (dateStr: string | null, startT: string, endT: string) => {
    if (!dateStr) return ''
    try {
      const dateObj = new Date(dateStr)
      // 한국어 포맷에서 마지막 마침표를 제거하기 위해 커스텀 포맷 사용
      const dateText = format(dateObj, "yyyy년 MM월 dd일", { locale: ko })
      return `${dateText} (${startT} ~ ${endT})`
    } catch (e) {
      return dateStr
    }
  }

  // 4. 일정 삭제 실행
  const handleDeleteEvent = () => {
    if (!editingEventId) return
    setEvents(events.filter(ev => ev.id !== editingEventId))
    setIsAddDialogOpen(false)
    toast.success('일정이 삭제되었습니다.')
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">Modern UI Showroom</h1>
        <p className="text-xl text-muted-foreground">프로젝트에 적용된 모든 고급 UI 컴포넌트 샘플을 확인하세요.</p>
      </div>

      <Separator />

      {/* 1. Charts Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Data Visualization (Recharts)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>주간 작업 현황 (Line Chart)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>주간 부하현황 (Bar Chart)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      cursor={{fill: '#f3f4f6'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="tasks" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. Data Table Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Data Management (TanStack Table)</h2>
        </div>
        <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[100px] font-bold">ID</TableHead>
                <TableHead className="font-bold">Task Name</TableHead>
                <TableHead className="font-bold">Priority</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">#{row.id}</TableCell>
                  <TableCell>{row.task}</TableCell>
                  <TableCell>
                    <Badge variant={row.priority === 'High' ? 'destructive' : row.priority === 'Medium' ? 'default' : 'secondary'}>
                      {row.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${row.status === 'Completed' ? 'bg-green-500' : 'bg-amber-500'}`} />
                      {row.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3. Advanced Form Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold">Forms (Hook Form + Zod)</h2>
          </div>
          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>유효성 검사 폼</CardTitle>
              <CardDescription>Zod 스키마를 이용한 실시간 유효성 검사 샘플입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} className="rounded-xl border-gray-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="hello@example.com" {...field} className="rounded-xl border-gray-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal rounded-xl border-gray-200 ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: ko })
                                ) : (
                                  <span>날짜 선택</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              locale={ko}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 shadow-lg">Submit</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>

        {/* 4. Calendar & Date Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold">Calendar & Scheduling</h2>
          </div>
          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>이벤트 일정 (FullCalendar)</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[430px]">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  locales={[koLocale]}
                  locale="ko"
                  dayCellContent={(arg) => arg.dayNumberText.replace('일', '')}
                  selectable={true}
                  select={handleSelect}
                  eventClick={handleEventClick}
                  headerToolbar={{
                    left: 'prev',
                    center: 'title',
                    right: 'next today'
                  }}
                  height="auto"
                  events={events}
                />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* New Weekly View Section */}
          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>주간 일정 (TimeGrid)</CardTitle>
              <CardDescription>시간 단위의 상세 일정을 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[430px]">
                <FullCalendar
                  plugins={[timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  locales={[koLocale]}
                  locale="ko"
                  dayHeaderContent={(arg) => {
                    // date-fns를 사용하여 "3. 15 (일)" 형식으로 직접 포맷팅
                    const formatted = format(arg.date, "M. d", { locale: ko })
                    const dayName = format(arg.date, "(E)", { locale: ko })
                    return `${formatted} ${dayName}`
                  }}
                  selectable={true}
                  select={handleSelect}
                  eventClick={handleEventClick}
                  displayEventTime={false}
                  headerToolbar={{
                    left: 'prev',
                    center: 'title',
                    right: 'next today'
                  }}
                  height="auto"
                  allDaySlot={true}
                  slotDuration="00:30:00"
                  events={events}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* 6. Utility Components Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Utility Components</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Numeric Keypad</CardTitle>
              <CardDescription>보안 입력이나 빠른 숫자 입력을 위한 커스텀 키패드입니다.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div className="w-full space-y-2">
                <Label htmlFor="keypad-input" className="text-gray-500 text-xs font-bold uppercase tracking-wider ml-1">입력된 값</Label>
                <Input 
                  id="keypad-input"
                  readOnly 
                  value={keypadValue} 
                  placeholder="숫자를 입력하세요"
                  className="h-14 text-2xl font-black text-center rounded-2xl border-gray-200 bg-white/80 shadow-inner"
                />
              </div>
              <NumericKeypad 
                onInput={handleKeypadInput}
                onDelete={handleKeypadDelete}
                onClear={handleKeypadClear}
                onConfirm={handleKeypadConfirm}
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Date Range Picker</CardTitle>
              <CardDescription>시작일과 종료일을 한 번에 선택할 수 있는 기간 선택기입니다.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 py-8">
              <div className="w-full space-y-2">
                <Label className="text-gray-500 text-xs font-bold uppercase tracking-wider ml-1">기간 선택</Label>
                <DatePickerWithRange 
                  date={rangeDate}
                  onDateChange={setRangeDate}
                  className="w-full"
                />
              </div>
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 w-full">
                <p className="text-sm text-indigo-700 font-medium text-center">
                  {rangeDate?.from ? (
                    rangeDate.to ? (
                      <span className="flex items-center justify-center gap-1 italic">
                        <Check className="w-4 h-4" /> 
                        {format(rangeDate.from, "yyyy년 MM월 dd일")} - {format(rangeDate.to, "yyyy년 MM월 dd일")}
                      </span>
                    ) : (
                      "종료일을 선택해주세요"
                    )
                  ) : (
                    "시작일을 선택해주세요"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm flex flex-col justify-center items-center p-8 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
              <Plus className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold">더 많은 컴포넌트 추가 예정</h3>
            <p className="text-muted-foreground max-w-sm">
              필요한 UI 컴포넌트가 있다면 언제든지 말씀해주세요. <br/>
              shadcn/ui와 커스텀 설계를 통해 최상의 디자인을 제공하겠습니다.
            </p>
          </Card>
        </div>
      </section>

      {/* Basic Components Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Standard Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
            <CardHeader><CardTitle>Interactive Elements</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium">Accept terms and conditions</label>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
            <CardHeader><CardTitle>In-App Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => toast.success('Operation completed!')}
              >
                Show Success Toast
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => toast.error('Something went wrong.')}
              >
                Show Error Toast
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
            <CardHeader><CardTitle>Badges & Status</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>New</Badge>
              <Badge variant="secondary">Active</Badge>
              <Badge variant="destructive">Urgent</Badge>
              <Badge variant="outline">Archived</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Schedule Registration Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingEventId ? '일정 수정 및 상세' : '새 일정 등록'}</DialogTitle>
            <DialogDescription>
              {formatSelectedDateTime(selectedDate, newStartTime, newEndTime)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* 일정명 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-semibold">
                일정명
              </Label>
              <Input
                id="name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="col-span-3 rounded-xl border-gray-200"
                placeholder="일정 제목을 입력하세요"
              />
            </div>
            
            {/* 시간 범위 (From/To) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right font-semibold">
                시작 시간
              </Label>
              <Input
                id="startTime"
                type="time"
                step="1800"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="col-span-3 rounded-xl border-gray-200"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right font-semibold">
                종료 시간
              </Label>
              <Input
                id="endTime"
                type="time"
                step="1800"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="col-span-3 rounded-xl border-gray-200"
              />
            </div>

            {/* 메모 */}
            <div className="grid grid-cols-4 items-top gap-4">
              <Label htmlFor="memo" className="text-right font-semibold mt-2">
                메모
              </Label>
              <Textarea
                id="memo"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="col-span-3 rounded-xl border-gray-200 resize-none h-24"
                placeholder="상세 내용을 입력하세요"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            {editingEventId && (
              <Button 
                variant="ghost" 
                onClick={handleDeleteEvent} 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl mr-auto"
              >
                삭제
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">취소</Button>
            <Button onClick={handleSaveEvent} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 shadow-lg shadow-indigo-100">
              {editingEventId ? '수정 완료' : '일정 저장'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
