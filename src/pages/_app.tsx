import '@/styles/globals.css'
import { api } from '@/utils/api'
import { Nunito } from '@next/font/google'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'

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
