import { SettingsDialog } from '@/components/settings-dialog'
import { timerUtils } from '@/pages'
import { useTimer } from '@/lib/stores/timer-store'
import { signIn, signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'

export const Header = () => {
  const session = useSession()
  const timer = useTimer()

  return (
    <>
      <Head>
        <title>{`Toki - ${timerUtils.formatTime(timer)} - Pomodoro`}</title>
      </Head>

      <div className='mx-auto flex h-16 items-center justify-center gap-4 px-8'>
        <Image src='/images/toki-logo.svg' width={96} height={96} alt='logo' />

        <SettingsDialog />

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

const HeaderButton = (props: { onClick?: () => void; label: string }) => (
  <button
    className='h-11 w-28 rounded-2xl font-semibold hover:bg-[#c75858fd]'
    onClick={props.onClick}
  >
    {props.label}
  </button>
)
