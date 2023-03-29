import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSettings, useSettingsActions } from '@/stores/settings-store'

export const SettingsDialog = () => {
  const settingsActions = useSettingsActions()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Settings</Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={settingsActions.persistNewSettings}
        className='sm:max-w-[425px]'
      >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Pomodoro
            </Label>
            <Settings />
          </div>
        </div>

        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const Settings = () => {
  const settings = useSettings()
  const settingsActions = useSettingsActions()

  const formatTime = (time: number) => {
    const addZeroBefore = (time: number) => ('0' + time.toString()).slice(-2)
    const minutes = Math.floor(time / 1000 / 60)

    return addZeroBefore(minutes)
  }

  return (
    <Input
      type='number'
      value={formatTime(settings.pomodoroTime)}
      onChange={(e) =>
        settingsActions.setSettings({
          ...settings,
          pomodoroTime: parseInt(e.target.value) * 1000 * 60,
        })
      }
    />
  )
}
