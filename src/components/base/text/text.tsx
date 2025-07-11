import {Text as RNText, StyleSheet} from 'react-native'
import colors from 'theme'
import {fonts, fontWeights} from '@/utils/fonts'
import {ITextProps} from './type'

export default (props: ITextProps) => {
  const {
    allowFontScaling = false,
    hide = false,
    style,
    text,
    color = colors.grayM1,
    children,
    fontWeight = 'normal',
    lang
  } = props
  if (hide) return null
  const isHindi = lang?.toLocaleLowerCase?.() === 'hi'
  const fontFamilyWight = fontWeights[fontWeight]
  const fontFamily = fontFamilyWight
    ? fontFamilyWight.font
    : fonts[props.font as keyof typeof fonts] || fonts.regular
  const fontSize = 14
  const styles = [
    stylesBase.base,
    {color, fontSize},
    {fontFamily: isHindi ? 'Default' : fontFamily},
    {fontWeight: isHindi ? fontFamilyWight.fontWeight : 'normal'},
    style
  ]
  const content = children ? children : text
  return (
    <RNText allowFontScaling={allowFontScaling} {...props} style={styles}>
      {content as string}
    </RNText>
  )
}

const stylesBase = StyleSheet.create({
  base: {
    textAlign: 'left',
    fontSize: 16,
    fontFamily: fonts.regular,
    includeFontPadding: false
  }
})
