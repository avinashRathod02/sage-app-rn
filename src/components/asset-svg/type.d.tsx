import {PressableProps, StyleProp, ViewStyle} from 'react-native'
import {SvgType} from './svg-icons'
import {IButtonViewProps} from 'components/base'

export interface AssetSvgProps {
  /**
   * Name of SVG icon.
   */
  name?: SvgType

  preserveAspectRatio?: string

  /**
   * Color of fillable SVG icon.
   */
  fill?: string

  /**
   * Size of SVG icon.
   * @default 24
   * width = height = size
   */
  size?: number | string

  /**
   * Width of SVG icon.
   */
  width?: number | string

  /**
   * Height of SVG icon.
   */
  height?: number | string

  /**
   * Styling for the icon container.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Handle the icon will render or not.
   * @default false
   */
  hide?: boolean

  /**
   * Additional props to pass to the ButtonView.
   */
  buttonViewProps?: IButtonViewProps

  /**
   * Container Style.
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * Handle additional non-existing type.
   */
  [key: string]: string | number | any
}
