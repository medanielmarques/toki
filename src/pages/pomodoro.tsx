/* eslint-disable @typescript-eslint/no-misused-promises */
import { type GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth'
import { prisma } from '@/server/db'
import { type Timer } from '@prisma/client'

import useSound from 'use-sound'
import {
  type Activity,
  useCurrentActivity,
  useIsTimerActive,
  useTimerActions,
  useTimer,
} from '@/timer-store'
import { Header } from '@/header'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  const userSettings = await prisma.timer.findFirst({
    where: {
      user_id: session?.user.id,
    },
    select: {
      pomodoro_time: true,
      short_break_time: true,
      long_break_time: true,
      pomodoro_count: true,
      short_break_count: true,
      long_break_count: true,
      auto_start_pomodoros: true,
      auto_start_breaks: true,
      long_break_interval: true,
      current_long_break_interval_count: true,
    },
  })

  return {
    props: { userSettings },
  }
}

const defaultSettings = {
  pomodoro_time: 1000 * 60 * 25, // 25 minutes
  short_break_time: 1000 * 60 * 5, // 5 minutes
  long_break_time: 1000 * 60 * 15, // 15 minutes
  pomodoro_count: 0,
  short_break_count: 0,
  long_break_count: 0,
  auto_start_pomodoros: true,
  auto_start_breaks: true,
  long_break_interval: 4,
}

const bubbleSfx = '../../audio/bubble.mp3'

export const timerUtils = {
  formatTime: (time: number) => {
    const addZeroBefore = (time: number) => ('0' + time.toString()).slice(-2)
    const seconds = Math.floor(time / 1000) % 60
    const minutes = Math.floor(time / 1000 / 60)

    return `${addZeroBefore(minutes)}:${addZeroBefore(seconds)}`
  },
}

export default function Pomodoro({ userSettings }: { userSettings: Timer }) {
  const timer = useTimer()
  const isTimerActive = useIsTimerActive()
  const timerActions = useTimerActions()

  const [playAlarm] = useSound(bubbleSfx, {
    volume: 0.05,
  })

  useEffect(() => {
    if (isTimerActive) {
      const countdownInterval = setInterval(timerActions.countdown, 1000)

      if (timer === 0) {
        clearInterval(countdownInterval)
        timerActions.toggleTimer()
        playAlarm()
      }
      return () => {
        clearInterval(countdownInterval)
        // timerActions.switchActivity()
      }
    }
  }, [timer, isTimerActive, playAlarm, timerActions])

  return (
    <>
      <Header />

      <div className='mt-40 flex justify-center'>
        <div className='text-center'>
          <div className='flex flex-col content-center items-center justify-between gap-12 rounded-2xl bg-[#312e45] py-8 px-16'>
            <div className='flex items-center gap-4'>
              <ActivityButton activity='pomodoro' label='Pomodoro' />
              <ActivityButton activity='shortBreak' label='Short Break' />
              <ActivityButton activity='longBreak' label='Long Break' />
            </div>

            <h1 className='text-9xl font-bold'>
              {timerUtils.formatTime(timer)}
            </h1>

            <button
              className='w-3/6 rounded-lg bg-white px-8 py-4 text-2xl font-bold text-sky-900 hover:bg-gray-200'
              onClick={timerActions.toggleTimer}
            >
              {isTimerActive ? 'PAUSE' : 'START'}
            </button>
          </div>
          <p className='mt-6 text-xl text-gray-400'>
            #{userSettings?.pomodoro_count || defaultSettings.pomodoro_count}
          </p>
        </div>
      </div>
    </>
  )
}

const ActivityButton = (props: { label: string; activity: Activity }) => {
  const currentActivity = useCurrentActivity()
  const timerActions = useTimerActions()

  return (
    <button
      className={`rounded-2xl py-3 px-6 ${
        props.activity === currentActivity ? 'bg-sky-900 ' : 'hover:bg-gray-700'
      }`}
      onClick={() => timerActions.switchActivity(props.activity)}
    >
      {props.label}
    </button>
  )
}
