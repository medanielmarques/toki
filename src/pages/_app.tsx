import '@/styles/globals.css'
import { api } from '@/utils/api'
import { Nunito } from '@next/font/google'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Analytics } from '@vercel/analytics/react'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'

export const nunito = Nunito({
  subsets: ['latin'],
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
        <Analytics />
        {/* <ReactQueryDevtools /> */}
      </main>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
