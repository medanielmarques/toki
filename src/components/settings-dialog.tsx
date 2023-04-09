import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSettings, useSettingsActions } from '@/lib/stores/settings-store'
import { api } from '@/utils/api'
import { Faders } from '@phosphor-icons/react'
import { useState } from 'react'

export const SettingsDialog = () => {
  const settings = useSettings()
  const settingsActions = useSettingsActions()

  const [open, setOpen] = useState(false)

  const utils = api.useContext()

  const saveNewSettings = async () => {
    utils.userSettings.get.setData(undefined, settings)

    return await settingsActions
      .persistNewSettings()
      .then(utils.userSettings.get.invalidate)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='flex cursor-pointer gap-3 rounded-full py-4 px-6 hover:bg-white/20'>
          <span className='text-white/90 md:text-lg'>Settings</span>
          <Faders size={24} />
        </div>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={saveNewSettings}
        onEscapeKeyDown={saveNewSettings}
        className='sm:max-w-[425px]'
      >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='flex gap-8'>
            <ChangePomodoroTime />
            <ChangeShortBreakTime />
            <ChangeLongBreakTime />
          </div>

          <ChangeAlarmVolume />
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              saveNewSettings()
              setOpen(false)
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ChangeAlarmVolume = () => {
  const settings = useSettings()
  const settingsActions = useSettingsActions()

  return (
    <div className='w-24'>
      <Label htmlFor='alarm-volume' className='text-gray-400'>
        Volume
      </Label>

      <Input
        id='alarm-volume'
        type='number'
        value={settings.alarmVolume}
        onChange={(e) =>
          settingsActions.setSettings({
            ...settings,
            alarmVolume: parseInt(e.target.value),
          })
        }
      />
    </div>
  )
}

const ChangePomodoroTime = () => {
  const settings = useSettings()
  const settingsActions = useSettingsActions()

  const formatTime = (time: number) => {
    const addZeroBefore = (time: number) => ('0' + time.toString()).slice(-2)
    const minutes = Math.floor(time / 1000 / 60)

    return addZeroBefore(minutes)
  }

  return (
    <div className='w-24'>
      <Label htmlFor='pomodoro' className='text-gray-400'>
        Pomodoro
      </Label>

      <Input
        id='pomodoro'
        type='number'
        value={formatTime(settings.pomodoroTime)}
        onChange={(e) =>
          settingsActions.setSettings({
            ...settings,
            pomodoroTime: parseInt(e.target.value) * 1000 * 60,
          })
        }
      />
    </div>
  )
}

const ChangeShortBreakTime = () => {
  const settings = useSettings()
  const settingsActions = useSettingsActions()

  const formatTime = (time: number) => {
    const addZeroBefore = (time: number) => ('0' + time.toString()).slice(-2)
    const minutes = Math.floor(time / 1000 / 60)

    return addZeroBefore(minutes)
  }

  return (
    <div className='w-24'>
      <Label htmlFor='short-break' className='text-gray-400'>
        Short Break
      </Label>

      <Input
        id='short-break'
        type='number'
        value={formatTime(settings.shortBreakTime)}
        onChange={(e) =>
          settingsActions.setSettings({
            ...settings,
            shortBreakTime: parseInt(e.target.value) * 1000 * 60,
          })
        }
      />
    </div>
  )
}

const ChangeLongBreakTime = () => {
  const settings = useSettings()
  const settingsActions = useSettingsActions()

  const formatTime = (time: number) => {
    const addZeroBefore = (time: number) => ('0' + time.toString()).slice(-2)
    const minutes = Math.floor(time / 1000 / 60)

    return addZeroBefore(minutes)
  }

  return (
    <div className='w-24'>
      <Label htmlFor='long-break' className='text-gray-400'>
        Long Break
      </Label>

      <Input
        id='long-break'
        type='number'
        value={formatTime(settings.longBreakTime)}
        onChange={(e) =>
          settingsActions.setSettings({
            ...settings,
            longBreakTime: parseInt(e.target.value) * 1000 * 60,
          })
        }
      />
    </div>
  )
}
