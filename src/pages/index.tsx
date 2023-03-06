/* eslint-disable @typescript-eslint/no-misused-promises */
import { type GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import { getServerSession } from 'next-auth'
import { signIn, signOut, useSession } from 'next-auth/react'
import { authOptions } from '@/server/auth'
import { prisma } from '@/server/db'
import { type Timer } from '@prisma/client'
import Head from 'next/head'

import useSound from 'use-sound'

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

const addZeroBefore = (time: number) => ('0' + time.toString()).slice(-2)
const formatTime = (time: number) => {
  const seconds = Math.floor(time / 1000) % 60
  const minutes = Math.floor(time / 1000 / 60)

  return `${addZeroBefore(minutes)}:${addZeroBefore(seconds)}`
}

const countDown = (time: number) => (time > 0 ? time - 1000 : time)

export default function Pomodoro({ userSettings }: { userSettings: Timer }) {
  const [timer, setTimer] = useState(3000)
  const [isTimerActive, setIsTimerActive] = useState(false)

  const [playAlarm] = useSound(bubbleSfx, {
    volume: 0.05,
  })

  const handleTimerState = () => setIsTimerActive((timer) => !timer)

  useEffect(() => {
    if (isTimerActive) {
      const countdownInterval = setInterval(() => setTimer(countDown), 1000)

      if (timer === 0) {
        clearInterval(countdownInterval)
        setIsTimerActive(false)
        playAlarm()
      }
      return () => clearInterval(countdownInterval)
    }
  }, [timer, isTimerActive, playAlarm])

  return (
    <>
      <Head>
        <title>Toki - {formatTime(timer)} - Pomodoro</title>
      </Head>

      <div className='mt-40 flex justify-center'>
        <div className='text-center'>
          <div className='flex flex-col content-center items-center justify-between gap-12 rounded-2xl bg-[#312e45] py-8 px-16'>
            <div className='flex items-center gap-4'>
              <ActivityButton label='Pomodoro' current />
              <ActivityButton label='Short Break' />
              <ActivityButton label='Long Break' />
            </div>

            <h1 className='text-9xl font-bold'>{formatTime(timer)}</h1>

            <button
              className='w-3/6 rounded-lg bg-white px-8 py-4 text-2xl font-bold text-sky-900 hover:bg-gray-200'
              onClick={handleTimerState}
            >
              {isTimerActive ? 'PAUSE' : 'START'}
            </button>
          </div>
          <p className='mt-6 text-xl text-gray-400'>
            #{userSettings?.pomodoroCount || defaultSettings.pomodoro_count}
          </p>
        </div>
      </div>
    </>
  )
}

const Header = () => {
  const session = useSession()

  return (
    <>
      {/* <Head>
        <title>Toki - {formatTime(timer)} - Pomodoro</title>
      </Head> */}
      <div className='mx-auto flex h-16 w-1/4 items-center justify-center bg-slate-900 px-8'>
        {session.status === 'unauthenticated' ? (
          <HeaderButton
            onClick={() => signIn('google', { callbackUrl: '/' })}
            label='Sign in'
          />
        ) : (
          <HeaderButton onClick={() => signOut()} label='Sign out' />
        )}
      </div>
    </>
  )
}

const HeaderButton = (props: { onClick: () => void; label: string }) => (
  <button
    className='h-11 w-28 rounded-full bg-slate-700 hover:bg-slate-600'
    onClick={props.onClick}
  >
    {props.label}
  </button>
)

const ActivityButton = (props: { label: string; current?: boolean }) => (
  <button
    className={`rounded-2xl py-3 px-6 ${
      !!props.current ? 'bg-sky-900 ' : 'hover:bg-gray-700'
    }`}
  >
    {props.label}
  </button>
)
