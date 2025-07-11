import {Vibration} from 'react-native'
import Haptic from 'react-native-haptic-feedback'
import {definePlatformParam, isAndroidPlatform} from './platform'
import ReactNativeHapticFeedback, {
  HapticFeedbackTypes
} from 'react-native-haptic-feedback'

export const vibrate = () => {
  const duration = definePlatformParam(20, 100)
  Vibration.vibrate(duration)
}

export const haptic = (type: keyof typeof HapticFeedbackTypes = 'soft') => {
  ReactNativeHapticFeedback.trigger(type, {
    ignoreAndroidSystemSettings: false
  })
}

export const HAPTIC_CONFIG = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true
}

export const longPressHaptic = () => {
  if (isAndroidPlatform) {
    Haptic.trigger('longPress', HAPTIC_CONFIG)
  } else {
    Haptic.trigger('impactMedium', HAPTIC_CONFIG)
  }
}
