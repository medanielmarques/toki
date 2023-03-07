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
    switchActivity: (activity: Activity) => void
    decideNextActivity: () => void
  }
}

const countdown = (time: number) => (time > 0 ? time - 1000 : time)

const decideNextActivity = (currentActivity: Activity): Activity => {
  const { currentLongBreakIntervalCount, longBreakInterval } =
    useSettingsStore.getState().userSettings

  const shouldNextActivityBeLongBreak =
    currentLongBreakIntervalCount === longBreakInterval - 1

  switch (currentActivity) {
    case 'pomodoro':
      return shouldNextActivityBeLongBreak ? 'longBreak' : 'shortBreak'
    default:
      return 'pomodoro'
  }
}

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

export const useTimerStore = create<TimerStore>((set, get) => ({
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

    switchActivity: (activity: Activity) =>
      set(
        produce<TimerStore>((state) => {
          state.currentActivity = activity
          state.timer = chooseNextTimer(activity)
          state.isTimerActive = false
        }),
      ),

    decideNextActivity: () => {
      const nextActivity = decideNextActivity(get().currentActivity)

      set(
        produce<TimerStore>((state) => {
          state.currentActivity = nextActivity
          state.timer = chooseNextTimer(nextActivity)
          state.isTimerActive = false
        }),
      )
    },
  },
}))

export const useTimer = () => useTimerStore((state) => state.timer)

export const useIsTimerActive = () =>
  useTimerStore((state) => state.isTimerActive)

export const useCurrentActivity = () =>
  useTimerStore((state) => state.currentActivity)

export const useTimerActions = () => useTimerStore((state) => state.actions)
