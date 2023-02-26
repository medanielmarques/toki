import { create } from 'zustand'

const defaultSettings = {
  pomodoro_time: 1000 * 60 * 25, // 25 minutes
  short_break_time: 1000 * 60 * 5, // 5 minutes
  long_break_time: 1000 * 60 * 15, // 15 minutes
  pomodoro_count: 0,
  short_break_count: 0,
  long_break_count: 0,
  auto_start_pomodoros: true,
  auto_start_breaks: true,
  long_break_interval: 4,
}

type Timer = {
  pomodoro_time: number
  short_break_time: number
  long_break_time: number
  pomodoro_count: number
  short_break_count: number
  long_break_count: number
  auto_start_pomodoros: boolean
  auto_start_breaks: boolean
  long_break_interval: number
}

type TimerStore = {
  timer: Timer
}

// const timerStore = create<TimerStore>((set) => ({
//   timer: {},
// }))
