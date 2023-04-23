import { type Activity } from '@/lib/stores/timer-store'

export const timerUtils = {
  formatTime: (time: number) => {
    const addZeroBefore = (time: number) => ('0' + time.toString()).slice(-2)
    const seconds = Math.floor(time / 1000) % 60
    const minutes = Math.floor(time / 1000 / 60)

    return `${addZeroBefore(minutes)}:${addZeroBefore(seconds)}`
  },

  formattedCurrentActivity: (activity: Activity) => {
    switch (activity) {
      case 'pomodoro':
        return 'Pomodoro'

      case 'shortBreak':
        return 'Short Break'

      case 'longBreak':
        return 'Long Break'
    }
  },
}
