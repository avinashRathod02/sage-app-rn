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
import LinearGradient from 'react-native-linear-gradient'

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
    color = 'transparent',
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
        <LinearGradient
          colors={isPrimary ? ['#1988C5', '#28DDCA'] : [colors.white, colors.white]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradientBackground}>
          {icon && !loading && (
            <AssetSvg name={icon} size={24} color={textColor} />
          )}
          <Text
            hide={loading}
            font="semiBold"
            style={[styles.title, {color: textColor}, titleStyle]}
            txOptions={txOptions}
            tx={tx}
            text={typeof title === 'string' ? title : undefined}
          >
            {typeof title !== 'string' ? title : null}
          </Text>
          {loading ? <ActivityIndicator size="small" color={textColor} /> : null}
        </LinearGradient>
      </ButtonView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.9,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center'
  },
  button: {
    height: 55,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 1000,
    overflow: 'hidden'
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
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
