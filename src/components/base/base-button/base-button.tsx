import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from 'react-native'
import {
  AssetSvg,
  ButtonView,
  IButtonViewProps,
  ITextProps,
  SvgType,
  Text
} from 'components'
import colors from 'theme'
import {ReactNode} from 'react'
import {SCREEN_WIDTH} from 'utils/size'

export interface IBaseButton extends IButtonViewProps {
  icon?: SvgType
  title?: string | ReactNode
  titleStyle?: TextStyle
  tx?: ITextProps['tx']
  txOptions?: ITextProps['txOptions']
  type?: 'primary' | 'outline'
  color?: string
  backgroundColor?: string
  loading?: boolean
  buttonStyle?: ViewStyle
  withShadow?: boolean
}

export const BaseButton = (props: IBaseButton) => {
  const {
    hide = false,
    loading,
    icon,
    type = 'primary',
    color = colors.blue,
    title,
    onPress,
    disabled,
    style,
    titleStyle,
    buttonStyle,
    withShadow = false,
    tx,
    txOptions,
    activeOpacity = 0.9
  } = props
  const isPrimary = type === 'primary'
  const buttonColor = color ? color : colors.primary

  const backgroundColor = isPrimary ? buttonColor : colors.white
  const borderColor = buttonColor
  const textColor = isPrimary ? colors.white : buttonColor
  const mainButtonStyle = [
    styles.button,
    {backgroundColor, borderColor},
    props?.backgroundColor && {backgroundColor: props.backgroundColor},
    buttonStyle
  ]
  if (hide) return null
  return (
    <View style={[styles.container, style]}>
      <ButtonView
        {...props}
        activeOpacity={activeOpacity}
        disabled={loading || disabled}
        loading={loading}
        onPress={onPress}
        style={mainButtonStyle}>
        {icon && !loading && (
          <AssetSvg name={icon} size={24} color={textColor} />
        )}
        <Text
          hide={loading}
          font="semiBold"
          style={[styles.title, {color: textColor}, titleStyle]}
          txOptions={txOptions}
          tx={tx}
          text={title}
        />
        {loading ? <ActivityIndicator size="small" color={textColor} /> : null}
      </ButtonView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.9,
    paddingVertical: 16,
    alignSelf: 'center'
  },
  button: {
    minHeight: 48,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
    color: 'white'
  }
})
