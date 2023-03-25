import { authOptions } from '@/server/auth'
import { prisma } from '@/server/db'
import { type Settings } from '@/stores/settings-store'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    const settings = JSON.parse(req.body) as Settings

    await prisma.timer.update({
      where: {
        userId: session.user.id,
      },
      data: settings,
    })

    return res.status(200).json({ message: 'success' })
  }

  res.status(404).json({ error: 'not authenticated' })
}
