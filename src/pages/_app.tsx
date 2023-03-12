import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { Nunito } from '@next/font/google'

import { api } from '@/utils/api'

import '@/styles/globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-nunito',
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={`${nunito.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
