import { ProfileSettings } from '@/components/profile-settings'
import { SettingsDialog } from '@/components/settings-dialog'
import { Head } from '@/header'
import { useSounds } from '@/lib/hooks/use-sounds'
import {
  defaultSettings,
  useSettings,
  useSettingsActions,
} from '@/lib/stores/settings-store'
import {
  useCurrentActivity,
  useIsTimerActive,
  useTimer,
  useTimerActions,
} from '@/lib/stores/timer-store'
import { api } from '@/utils/api'
import { timerUtils } from '@/utils/timer'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo } from 'react'

export default function Pomodoro() {
  const timer = useTimer()
  const isTimerActive = useIsTimerActive()
  const timerActions = useTimerActions()
  const currentActivity = useCurrentActivity()
  const settingsActions = useSettingsActions()

  const session = useSession()

  const userSettings = api.userSettings.get.useQuery(undefined, {
    refetchOnWindowFocus: false,
    initialData: defaultSettings,
  })

  const utils = api.useContext()

  const updateActivityCount = api.userSettings.updateActivityCount.useMutation()

  const { playToggleTimerSound, playAlarmSound } = useSounds()

  const countdown = () => {
    if (isTimerActive) {
      const countdownInterval = setInterval(timerActions.countdown, 1000)

      if (timer === 0) {
        timerActions.toggleTimer()
        timerActions.decideNextActivity(
          session.status,
          utils.userSettings.get.invalidate,
        )
        playAlarmSound()

        if (session.status === 'authenticated') {
          updateActivityCount.mutate({ field: currentActivity })
        }
      }
      return () => {
        clearInterval(countdownInterval)
      }
    }
  }

  useMemo(() => {
    if (userSettings.data) {
      settingsActions.setSettings(userSettings.data)
      timerActions.setTimer(userSettings.data.pomodoroTime)
    }
  }, [settingsActions, timerActions, userSettings.data])

  useEffect(countdown, [
    timer,
    isTimerActive,
    playAlarmSound,
    timerActions,
    updateActivityCount,
    userSettings,
    currentActivity,
    session.status,
    utils.userSettings.get.invalidate,
  ])

  return (
    <>
      <Head />

      <div className='flex h-screen flex-col items-center justify-between gap-6 px-4 pt-8 pb-6'>
        <div className='container flex flex-col gap-12'>
          <div className='mx-auto flex items-center gap-2'>
            <SettingsDialog />
            <ProfileSettings />
          </div>

          <div className='flex flex-col items-center gap-6'>
            <Timer />
            <p className='text-xl text-white/100 md:text-2xl'>
              {timerUtils.formattedCurrentActivity(currentActivity)}
            </p>
          </div>
        </div>

        <button
          className='container max-w-xl rounded-3xl bg-white/75 px-8 py-5 text-2xl font-medium text-black'
          onClick={() => {
            timerActions.toggleTimer()
            playToggleTimerSound()
          }}
        >
          {isTimerActive ? 'Stop' : 'Start'} timer
        </button>
      </div>
    </>
  )
}

const Timer = () => {
  const timer = useTimer()
  const settings = useSettings()
  const currentActivity = useCurrentActivity()

  const calculateTimeFraction = () => {
    const timeLimit = settings[`${currentActivity}Time`] / 1000
    const timeLeft = timer / 1000

    const rawTimeFraction = timeLeft / timeLimit

    const timeFraction =
      rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction)

    return (timeFraction * 283).toFixed(0)
  }

  return (
    <div className='relative h-56 w-56 md:h-72 md:w-72'>
      <svg
        className='scale-x-[-1]'
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g className='fill-none stroke-none'>
          <circle
            className='stroke-white/25 stroke-[7px]'
            cx='50'
            cy='50'
            r='45'
          />
          <path
            strokeDasharray={`${calculateTimeFraction()} 283`}
            className='base-timer__path-remaining'
            d='
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
              '
          />
        </g>
      </svg>
      <span className='absolute top-0 flex h-56 w-56 items-center justify-center text-4xl md:h-72 md:w-72 md:text-5xl'>
        {timerUtils.formatTime(timer)}
      </span>
    </div>
  )
}
