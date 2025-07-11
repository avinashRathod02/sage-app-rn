import {LocalizationKeys} from 'locales/use-translation'
import {TextProps} from 'react-native'
import {fonts} from 'utils/fonts'
export interface ITextProps extends TextProps {
  text?: string
  color?: string
  size?: number
  tx?: LocalizationKeys
  txOptions?: any
  hide?: boolean
  font?: keyof typeof fonts
  fontWeight?: 'normal' | 'bold' | 'light' | 'medium' | 'regular' | 'semibold'
  lang?: 'HI' | 'EN'
}
