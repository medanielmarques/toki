import { create } from 'zustand'
import { useTimerStore } from '@/stores/timer-store'

export const defaultSettings = {
  pomodoroTime: 1000 * 60 * 25, // 25 minutes
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

export type Settings = typeof defaultSettings

type SettingsStore = {
  userSettings: Settings
  actions: {
    setSettings: (settings: Settings) => void
    persistNewSettings: () => void
  }
}

const persistNewSettings = async (settings: Settings) => {
  await fetch('api/settings/update-all', {
    method: 'POST',
    body: JSON.stringify(settings),
  })
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  userSettings: defaultSettings,

  actions: {
    setSettings: (settings: Settings) => set({ userSettings: settings }),

    persistNewSettings: () => persistNewSettings(get().userSettings),
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
