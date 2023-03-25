import {
  Dialog,
  DialogContent,
  DialogDescription,
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
        <Button variant='outline'>Edit Profile</Button>
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
            <Settings />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Username
            </Label>
            <Input id='username' value='@peduarte' className='col-span-3' />
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

  return (
    <Input
      type='number'
      value={settings.pomodoroTime}
      onChange={() => settingsActions.setSettings(settings)}
    />
  )
}
