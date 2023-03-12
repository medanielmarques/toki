import { create } from 'zustand'
import produce from 'immer'
import { useSettingsStore } from '@/settings-store'

export type Activity = 'pomodoro' | 'shortBreak' | 'longBreak'

type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading'

type TimerStore = {
  timer: number
  currentActivity: Activity
  isTimerActive: boolean
  actions: {
    setTimer: (newTime: number) => void
    toggleTimer: () => void
    countdown: () => void
    switchActivity: (activity: Activity) => void
    decideNextActivity: (session: SessionStatus) => void
  }
}

const countdown = (time: number) => (time > 0 ? time - 1000 : time)

const increaseLongBreakIntervalCount = async () =>
  await fetch('api/update-long-break-interval-count/increase')

const resetLongBreakIntervalCount = async () =>
  await fetch('api/update-long-break-interval-count/reset')

const decideNextActivity = (
  currentActivity: Activity,
  sessionStatus: SessionStatus,
): Activity => {
  const { currentLongBreakIntervalCount, longBreakInterval } =
    useSettingsStore.getState().userSettings

  const shouldNextActivityBeLongBreak =
    currentLongBreakIntervalCount === longBreakInterval - 1

  if (sessionStatus === 'authenticated' && currentActivity === 'pomodoro') {
    if (shouldNextActivityBeLongBreak) {
      resetLongBreakIntervalCount()
    } else {
      increaseLongBreakIntervalCount()
    }
  }

  switch (currentActivity) {
    case 'pomodoro':
      return shouldNextActivityBeLongBreak ? 'longBreak' : 'shortBreak'
    default:
      return 'pomodoro'
  }
}

const decideNextTimer = (activity: Activity) => {
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

export const useTimerStore = create<TimerStore>((set, get) => {
  return {
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
            state.timer = decideNextTimer(activity)
            state.isTimerActive = false
          }),
        ),

      decideNextActivity: (sessionStatus: SessionStatus) => {
        const nextActivity = decideNextActivity(
          get().currentActivity,
          sessionStatus,
        )

        set(
          produce<TimerStore>((state) => {
            state.currentActivity = nextActivity
            state.timer = decideNextTimer(nextActivity)
            state.isTimerActive = false
          }),
        )
      },
    },
  }
})

export const useTimer = () => useTimerStore((state) => state.timer)

export const useIsTimerActive = () =>
  useTimerStore((state) => state.isTimerActive)

export const useCurrentActivity = () =>
  useTimerStore((state) => state.currentActivity)

export const useTimerActions = () => useTimerStore((state) => state.actions)
