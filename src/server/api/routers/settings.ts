import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { prisma } from '@/server/db'
import { z } from 'zod'

export const settingsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const userSettings = await prisma.timer.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        pomodoroTime: true,
        shortBreakTime: true,
        longBreakTime: true,
        pomodoroCount: true,
        shortBreakCount: true,
        longBreakCount: true,
        autoStartPomodoros: true,
        autoStartBreaks: true,
        longBreakInterval: true,
        currentLongBreakIntervalCount: true,
      },
    })

    return userSettings
  }),

  updateActivityCount: protectedProcedure
    .input(
      z.object({
        field: z.enum(['pomodoro', 'shortBreak', 'longBreak']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.timer.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          [`${input.field}Count`]: {
            increment: 1,
          },
        },
      })
    }),
})
