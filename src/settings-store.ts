import { create } from 'zustand'
import produce from 'immer'
import { useTimerStore } from '@/timer-store'

export const defaultSettings = {
  pomodoroTime: 1000, // 25 minutes
  shortBreakTime: 1000 * 60 * 5, // 5 minutes
  longBreakTime: 1000 * 60 * 15, // 15 minutes
  pomodoroCount: 0,
  shortBreakCount: 0,
  longBreakCount: 0,
  autoStartPomodoros: true,
  autoStartBreaks: true,
  longBreakInterval: 4,
  currentLongBreakIntervalCount: 0,
}

type Settings = {
  pomodoroTime: number
  shortBreakTime: number
  longBreakTime: number
  pomodoroCount: number
  shortBreakCount: number
  longBreakCount: number
  autoStartPomodoros: boolean
  autoStartBreaks: boolean
  longBreakInterval: number
  currentLongBreakIntervalCount: number
}

type SettingsStore = {
  userSettings: Settings
  actions: {
    setSettings: (settings: Settings) => void
  }
}

// Maybe use jotai instead.
// I'd just need to create a function to initially set the state of all the
// atoms (to make the process simpler), and them use them individually.
export const useSettingsStore = create<SettingsStore>((set) => ({
  userSettings: defaultSettings,

  actions: {
    setSettings: (settings: Settings) =>
      set(
        produce<SettingsStore>((state) => {
          state.userSettings = settings
        }),
      ),
  },
}))

export const activityCount = () => {
  const { currentActivity } = useTimerStore.getState()
  const { pomodoroCount, shortBreakCount, longBreakCount } =
    useSettingsStore.getState().userSettings

  switch (currentActivity) {
    case 'pomodoro':
      return pomodoroCount
    case 'shortBreak':
      return shortBreakCount
    case 'longBreak':
      return longBreakCount
  }
}

export const useSettings = () => useSettingsStore((state) => state.userSettings)

export const useSettingsActions = () =>
  useSettingsStore((state) => state.actions)
