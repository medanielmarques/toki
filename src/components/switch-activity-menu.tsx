import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrentActivity } from '@/lib/stores/timer-store'
import { timerUtils } from '@/utils/timer'
import { ChevronDown } from 'lucide-react'

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
            <span>Short Break</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className='mr-4 flex justify-center text-xl font-bold text-white hover:bg-none md:text-2xl'
            onClick={() => 1}
          >
            <span>Long Break</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
