import { create } from 'zustand'
import produce from 'immer'
import { useSettingsStore } from '@/settings-store'

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
    switchActivity: (activity: Activity) => void
  }
}

const countdown = (time: number) => (time > 0 ? time - 1000 : time)

// chooseNextActivity()

const chooseNextTimer = (activity: Activity) => {
  const settings = useSettingsStore.getState().userSettings

  switch (activity) {
    case 'pomodoro':
      return settings.pomodoroTime
    case 'shortBreak':
      return settings.shortBreakTime
    case 'longBreak':
      return settings.longBreakTime
  }
}

export const useTimerStore = create<TimerStore>((set) => ({
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

    switchActivity: (activity: Activity) =>
      set(
        produce<TimerStore>((state) => {
          state.currentActivity = activity
          state.timer = chooseNextTimer(activity)
          state.isTimerActive = false
        }),
      ),
  },
}))

export const useTimer = () => useTimerStore((state) => state.timer)

export const useIsTimerActive = () =>
  useTimerStore((state) => state.isTimerActive)

export const useCurrentActivity = () =>
  useTimerStore((state) => state.currentActivity)

export const useTimerActions = () => useTimerStore((state) => state.actions)
