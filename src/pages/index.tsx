import { Header } from '@/header'
import { useSounds } from '@/lib/hooks/use-sounds'
import {
  activityCount,
  defaultSettings,
  useSettings,
  useSettingsActions,
} from '@/lib/stores/settings-store'
import {
  type Activity,
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
      <Header />

      <div className='mt-40 flex justify-center'>
        <div className='text-center'>
          <div className='flex flex-col content-center items-center justify-between gap-16 rounded-2xl bg-[#c75858fd] py-10 px-20'>
            <div className='flex items-center gap-4'>
              <ActivityButton activity='pomodoro' label='Pomodoro' />
              <ActivityButton activity='shortBreak' label='Short Break' />
              <ActivityButton activity='longBreak' label='Long Break' />
            </div>

            <Timer />

            <button
              className='w-9/12 rounded-lg border-2 border-white px-8 py-6 text-3xl font-bold text-white  hover:bg-white hover:text-[#bb3e4a]'
              onClick={() => {
                timerActions.toggleTimer()
                playToggleTimerSound()
              }}
            >
              {isTimerActive ? 'PAUSE' : 'START'}
            </button>
          </div>
          <p className='mt-6 text-xl text-gray-200'>
            You&apos;ve done #{activityCount()} {currentActivity}s!
          </p>
        </div>
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

    console.log(timeLeft, 'timeLimit')

    const rawTimeFraction = timeLeft / timeLimit

    const timeFraction =
      rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction)

    return (timeFraction * 283).toFixed(0)
  }

  return (
    <div className='relative h-80 w-80'>
      <svg
        className='scale-x-100'
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g className='fill-none stroke-none'>
          <circle
            className='stroke-gray-300 stroke-[7px]'
            cx='50'
            cy='50'
            r='45'
          />
          <path
            stroke-dasharray={`${calculateTimeFraction()} 283`}
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
      <span className='absolute top-0 flex h-80 w-80 items-center justify-center text-5xl'>
        {timerUtils.formatTime(timer)}
      </span>
    </div>
  )
}

const ActivityButton = (props: { label: string; activity: Activity }) => {
  const currentActivity = useCurrentActivity()
  const timerActions = useTimerActions()

  const utils = api.useContext()

  return (
    <button
      className={`rounded-2xl py-3 px-6 text-lg font-bold ${
        props.activity === currentActivity
          ? 'bg-[#b04646fd]'
          : 'hover:bg-[#ae5656fd]'
      }`}
      onClick={() => {
        timerActions.switchActivity(props.activity)
        utils.userSettings.get.invalidate()
      }}
    >
      {props.label}
    </button>
  )
}
