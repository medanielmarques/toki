import { Header } from '@/header'
import { useSounds } from '@/lib/hooks/use-sounds'
import {
  activityCount,
  defaultSettings,
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
import { useMemo } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

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
      duration={timer / 1000}
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
        console.log({ timer: timer / 1000, remainingTime }, 'yeah')

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
