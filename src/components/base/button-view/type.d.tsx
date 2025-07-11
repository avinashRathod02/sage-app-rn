import {TouchableOpacityProps, ViewStyle} from 'react-native'

export interface IButtonViewProps extends TouchableOpacityProps {
  /**
   * Name of the button property.
   * @default normal
   * ripple -> react-native-material-ripple
   */
  button?: 'normal' | 'ripple' | 'highlight'

  /**
   * Size of the zoom animation view.
   */
  scale?: number

  /**
   * Handle the component will render or not.
   * @default false
   */
  hide?: boolean

  /**
   * Handle the hit-slop.
   * @default false
   */
  withHitSlop?: boolean

  /**
   * The color of the underlay that will show through when the touch is active.
   */
  underlayColor?: string | any
  activeOpacity?: number
  isCard?: boolean
  applyDisabledStyle?: boolean
  disableAction?: boolean
  baseClass?: string
  containerStyle?: ViewStyle
  withRipple?: boolean
  loading?: boolean
}
