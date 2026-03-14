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
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'

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
                  headerToolbar={{
                    left: 'prev',
                    center: 'title',
                    right: 'next today'
                  }}
                  height="auto"
                  events={[
                    { title: '프로젝트 킥오프', date: new Date().toISOString().split('T')[0] },
                    { title: '클라이언트 미팅', date: new Date(Date.now() + 86400000).toISOString().split('T')[0] }
                  ]}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* 5. Basic Components Section */}
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
    </div>
  )
}
