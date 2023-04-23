import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Activity, useCurrentActivity } from '@/lib/stores/timer-store'
import { timerUtils } from '@/utils/timer'
import { ChevronDown } from 'lucide-react'

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
    case 'pomodoro' || 'shortBreak':
      return 'Long Break'
    default:
      return 'Short Break'
  }
}

export const SwitchActivityMenu = () => {
  const currentActivity = useCurrentActivity()

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

      <DropdownMenuContent className='w-56 bg-transparent md:w-72'>
        <DropdownMenuGroup className='text-center'>
          <DropdownMenuItem
            className='mr-4 flex justify-center text-xl font-bold text-white hover:bg-none focus:bg-none dark:hover:bg-none dark:focus:bg-none md:text-2xl'
            onClick={() => 1}
          >
            <span>{switchActivityMenuFirstItem(currentActivity)}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className='mr-4 flex justify-center text-xl font-bold text-white hover:bg-none md:text-2xl'
            onClick={() => 1}
          >
            <span>{switchActivityMenuSecondItem(currentActivity)}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
