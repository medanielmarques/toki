import { create } from 'zustand'
import produce from 'immer'

const defaultSettings = {
  pomodoroTime: 1000 * 60 * 25, // 25 minutes
  shortBreakTime: 1000 * 60 * 5, // 5 minutes
  longBreakTime: 1000 * 60 * 15, // 15 minutes
  pomodoroCount: 0,
  shortBreakCount: 0,
  longBreakCount: 0,
  autoStartPomodoros: true,
  autoStartBreaks: true,
  longBreakInterval: 4,
}

type UserSettings = {
  pomodoroTime: number
  shortBreakTime: number
  longBreakTime: number
  pomodoroCount: number
  shortBreakCount: number
  longBreakCount: number
  autoStartPomodoros: boolean
  autoStartBreaks: boolean
  longBreakInterval: number
}

type UserSettingsStore = {
  userSettings: UserSettings
}

const useUserSettingsStore = create<UserSettingsStore>((set) => ({
  userSettings: defaultSettings,
}))

export type Activity = 'pomodoro' | 'shortBreak' | 'longBreak'

type TimerStore = {
  timer: number
  currentActivity: Activity
  isTimerActive: boolean

  actions: {
    setTimer: (newTime: number) => void
    toggleTimer: () => void
    countdown: () => void
    playAlarm: () => void
    switchActivity: (activity?: Activity) => void
  }
}

const countdown = (time: number) => (time > 0 ? time - 1000 : time)

const useTimerStore = create<TimerStore>((set) => ({
  timer: 1000 * 60 * 25, // 25 minutes
  currentActivity: 'pomodoro',
  isTimerActive: false,

  actions: {
    setTimer: (newTime: number) =>
      set(
        produce<TimerStore>((state) => {
          state.timer = newTime
        }),
      ),

    toggleTimer: () =>
      set(
        produce<TimerStore>((state) => {
          state.isTimerActive = !state.isTimerActive
        }),
      ),

    countdown: () =>
      set(
        produce<TimerStore>((state) => {
          state.timer = countdown(state.timer)
        }),
      ),

    playAlarm: () => ({}),

    switchActivity: () => ({}),
  },
}))

export const useTimer = () => useTimerStore((state) => state.timer)

export const useIsTimerActive = () =>
  useTimerStore((state) => state.isTimerActive)

export const useCurrentActivity = () =>
  useTimerStore((state) => state.currentActivity)

export const useTimerActions = () => useTimerStore((state) => state.actions)
