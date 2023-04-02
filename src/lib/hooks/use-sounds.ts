import { useSettings } from '@/lib/stores/settings-store'
import useSound from 'use-sound'

const bubbleSfx = '../../audio/bubble.mp3'
const toggleTimerSfx = '../../audio/toggle-timer.mp3'

export const useSounds = () => {
  const settings = useSettings()

  const [playAlarmSound] = useSound(bubbleSfx, {
    volume: settings.alarmVolume / 100,
  })

  const [playToggleTimerSound] = useSound(toggleTimerSfx, { volume: 100 })

  return { playAlarmSound, playToggleTimerSound }
}
