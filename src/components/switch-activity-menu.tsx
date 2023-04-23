import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  type Activity,
  useCurrentActivity,
  useTimerActions,
} from '@/lib/stores/timer-store'
import { api } from '@/utils/api'
import { timerUtils } from '@/utils/timer'
import { ChevronDown } from 'lucide-react'
import { useSession } from 'next-auth/react'

const switchActivityMenuFirstItem = (currentActivity: Activity) => {
  switch (currentActivity) {
    case 'pomodoro':
      return 'Short Break'
    default:
      return 'Pomodoro'
  }
}

const switchActivityMenuSecondItem = (currentActivity: Activity) => {
  switch (currentActivity) {
    case 'pomodoro':
      return 'Long Break'
    case 'shortBreak':
      return 'Long Break'
    default:
      return 'Short Break'
  }
}

export const SwitchActivityMenu = () => {
  const currentActivity = useCurrentActivity()
  const timerActions = useTimerActions()
  const session = useSession()
  const utils = api.useContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex cursor-pointer items-center gap-2'>
          <span className='text-xl font-bold md:text-2xl'>
            {timerUtils.formattedCurrentActivity(currentActivity)}
          </span>
          <ChevronDown size={18} />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className=' w-[201px] bg-transparent md:w-[259px]'>
        <DropdownMenuGroup className='text-center'>
          <DropdownMenuItem
            className='mr-4 flex justify-center text-xl font-bold text-white md:text-2xl'
            onClick={() =>
              timerActions.decideNextActivity(
                session.status,
                utils.userSettings.get.invalidate,
              )
            }
          >
            <span>{switchActivityMenuFirstItem(currentActivity)}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className='mr-4 flex justify-center text-xl font-bold text-white md:text-2xl'
            onClick={() =>
              timerActions.decideNextActivity(
                session.status,
                utils.userSettings.get.invalidate,
              )
            }
          >
            <span>{switchActivityMenuSecondItem(currentActivity)}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
