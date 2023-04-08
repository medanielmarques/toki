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
import React, { useEffect, useMemo } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import { settings } from '.eslintrc.cjs'

export default function Pomodoro() {
  const isTimerActive = useIsTimerActive()
  const timerActions = useTimerActions()
  const currentActivity = useCurrentActivity()
  const settingsActions = useSettingsActions()

  const userSettings = api.userSettings.get.useQuery(undefined, {
    refetchOnWindowFocus: false,
    initialData: defaultSettings,
  })

  const { playToggleTimerSound } = useSounds()

  useMemo(() => {
    if (userSettings.data) {
      settingsActions.setSettings(userSettings.data)
      timerActions.setTimer(userSettings.data.pomodoroTime)
    }
  }, [settingsActions, timerActions, userSettings.data])

  useEffect(() => {
    if (isTimerActive) {
      const countdownInterval = setInterval(timerActions.countdown, 1000)

      return () => clearInterval(countdownInterval)
    }
  }, [isTimerActive])

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

            <NewTimer />

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

const NewTimer = () => {
  const timer = useTimer()
  const settings = useSettings()

  const timeLeft = settings.pomodoroTime - timer

  const calculateTimeFraction = () => {
    const rawTimeFraction = timeLeft / settings.pomodoroTime
    return rawTimeFraction - (1 / settings.pomodoroTime) * (1 - rawTimeFraction)
  }

  return (
    <div className='relative h-[300px] w-[300px]'>
      <svg
        className='scale-x-[-1]'
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g className='stroke-none. fill-none'>
          <circle
            className='stroke-gray-500 stroke-[7px]'
            cx='50'
            cy='50'
            r='45'
          ></circle>
          <path
            id='base-timer-path-remaining'
            stroke-dasharray={`${calculateTimeFraction() * 283} 283`}
            className='base-timer__path-remaining'
            d='
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
              '
          ></path>
        </g>
      </svg>
      <span
        id='base-timer-label'
        className='absolute top-0 flex h-[300px] w-[300px] items-center justify-center text-5xl'
      >
        {timerUtils.formatTime(timer)}
      </span>
    </div>
  )
}

const Timer = () => {
  const settings = useSettings()
  const isTimerActive = useIsTimerActive()
  const timerActions = useTimerActions()
  const currentActivity = useCurrentActivity()

  const session = useSession()
  const { playAlarmSound } = useSounds()

  const userSettings = api.userSettings.get.useQuery(undefined, {
    refetchOnWindowFocus: false,
    initialData: defaultSettings,
  })

  const updateActivityCount = api.userSettings.updateActivityCount.useMutation()

  return (
    <CountdownCircleTimer
      isPlaying={isTimerActive}
      duration={settings.pomodoroTime / 1000}
      updateInterval={1}
      colors='#A30000'
      onComplete={() => {
        timerActions.toggleTimer()
        timerActions.decideNextActivity(session.status)
        playAlarmSound()

        if (session.status === 'authenticated') {
          updateActivityCount.mutate(
            { field: currentActivity },
            {
              onSuccess: () => {
                userSettings.refetch()
              },
            },
          )
        }

        return { shouldRepeat: true }
      }}
    >
      {({ remainingTime }) => {
        timerActions.setTimer(remainingTime * 1000)
        return timerUtils.formatTime(remainingTime * 1000)
      }}
    </CountdownCircleTimer>
  )
}

const ActivityButton = (props: { label: string; activity: Activity }) => {
  const currentActivity = useCurrentActivity()
  const timerActions = useTimerActions()

  return (
    <button
      className={`rounded-2xl py-3 px-6 text-lg font-bold ${
        props.activity === currentActivity
          ? 'bg-[#b04646fd]'
          : 'hover:bg-[#ae5656fd]'
      }`}
      onClick={() => timerActions.switchActivity(props.activity)}
    >
      {props.label}
    </button>
  )
}
