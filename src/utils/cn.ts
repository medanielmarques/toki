import { nunito } from '@/pages/_app'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) =>
  twMerge(clsx(inputs), nunito.variable)
