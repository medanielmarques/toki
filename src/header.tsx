import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { timerUtils } from '@/pages'
import { useTimer } from '@/stores/timer-store'
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

const SettingsDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant='outline'>Edit Profile</Button>
    </DialogTrigger>
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when youre done.
        </DialogDescription>
      </DialogHeader>
      <div className='grid gap-4 py-4'>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='name' className='text-right'>
            Name
          </Label>
          <Input id='name' value='Pedro Duarte' className='col-span-3' />
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='username' className='text-right'>
            Username
          </Label>
          <Input id='username' value='@peduarte' className='col-span-3' />
        </div>
      </div>
      <DialogFooter>
        <Button type='submit'>Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
