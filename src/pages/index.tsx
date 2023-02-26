/* eslint-disable @typescript-eslint/no-misused-promises */
import { type GetServerSideProps } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { getServerSession } from 'next-auth'
import { signIn, useSession } from 'next-auth/react'
import { authOptions } from '@/server/auth'
import { prisma } from '@/server/db'
import { type Timer } from '@prisma/client'
import Head from 'next/head'

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

const addZeroBefore = (time: number) => ('0' + time.toString()).slice(-2)
const formatTime = (time: number) => {
  const seconds = Math.floor(time / 1000) % 60
  const minutes = Math.floor(time / 1000 / 60)

  return `${addZeroBefore(minutes)}:${addZeroBefore(seconds)}`
}

const countDown = (time: number) => (time > 0 ? time - 1000 : time)

export default function Pomodoro({ userSettings }: { userSettings: Timer }) {
  const session = useSession()
  const [timer, setTimer] = useState(10000)

  useEffect(() => {
    const countdownInterval = setInterval(() => setTimer(countDown), 1000)

    if (timer === 0) clearInterval(countdownInterval)
    return () => clearInterval(countdownInterval)
  }, [timer])

  return (
    <>
      <Head>
        <title>Toki - {formatTime(timer)} - Pomodoro</title>
      </Head>

      <div className='mt-40 flex justify-center'>
        {session.status === 'unauthenticated' ? (
          <button onClick={() => signIn('google', { callbackUrl: '/' })}>
            Sign in
          </button>
        ) : null}

        <div className='text-center'>
          <div className='flex flex-col content-center items-center justify-between gap-12 rounded-2xl bg-[#312e45] py-8 px-16'>
            <div className='flex items-center gap-4'>
              <ActivityButton label='Pomodoro' current />
              <ActivityButton label='Short Break' />
              <ActivityButton label='Long Break' />
            </div>

            <h1 className='text-9xl font-bold'>{formatTime(timer)}</h1>

            <button className='w-3/6 rounded-lg bg-white px-8 py-4 text-2xl font-bold text-sky-900 hover:bg-gray-200'>
              START
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

const ActivityButton = (props: { label: string; current?: boolean }) => (
  <button
    className={`rounded-2xl py-3 px-6 ${
      !!props.current ? 'bg-sky-900 ' : 'hover:bg-gray-700'
    }`}
  >
    {props.label}
  </button>
)
