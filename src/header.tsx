import { timerUtils } from '@/pages'
import { useTimer } from '@/timer-store'
import { signIn, signOut, useSession } from 'next-auth/react'
import Head from 'next/head'

export const Header = () => {
  const session = useSession()
  const timer = useTimer()

  return (
    <>
      <Head>
        <title>{`Toki - ${timerUtils.formatTime(timer)} - Pomodoro`}</title>
      </Head>
      <div className='mx-auto flex h-16 w-1/4 items-center justify-center px-8'>
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
