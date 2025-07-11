import {Text as RNText, StyleSheet} from 'react-native'
import {fonts, } from '@/utils/fonts'
import {ITextProps} from './type'

export default (props: ITextProps) => {
  const {
    allowFontScaling = false,
    hide = false,
    style,
    text,
    children,
  } = props
  if (hide) return null
  
  const styles = [
    stylesBase.base,
    style
  ]
  const content = children ? children : text
  return (
    <RNText className='text-gray-900' allowFontScaling={allowFontScaling} {...props} style={styles}>
      {content as string}
    </RNText>
  )
}

const stylesBase = StyleSheet.create({
  base: {
    textAlign: 'left',
    fontFamily: fonts.regular,
    includeFontPadding: false
  }
})
