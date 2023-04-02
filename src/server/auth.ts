import { env } from '@/env.mjs'
import { prisma } from '@/server/db'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { type Prisma } from '@prisma/client'
import { type GetServerSidePropsContext } from 'next'
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from 'next-auth'
import { type Adapter } from 'next-auth/adapters'
import GoogleProvider from 'next-auth/providers/google'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

const TokiAdapter = (): Adapter => ({
  ...PrismaAdapter(prisma),

  // eslint-disable-next-line
  // @ts-ignore
  createUser: (data: Prisma.UserCreateInput) => {
    return prisma.user.create({ data }).then(async (user) => {
      await prisma.timer.create({
        data: {
          userId: user.id,
        },
      })

      return user
    })
  },
})

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  adapter: TokiAdapter(),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
}

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
