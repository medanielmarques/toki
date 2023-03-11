import { settingsRouter } from '@/server/api/routers/settings'
import { createTRPCRouter } from '@/server/api/trpc'

export const appRouter = createTRPCRouter({
  userSettings: settingsRouter,
})

export type AppRouter = typeof appRouter
