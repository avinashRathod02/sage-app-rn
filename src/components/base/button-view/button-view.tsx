import {useState} from 'react'
import {
  Animated,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native'
import {hitSlop} from 'utils/size'
import {IButtonViewProps} from './type.d'
import colors from 'theme'

export const ButtonView = (props: IButtonViewProps) => {
  const {
    hide,
    activeOpacity = 0.9,
    disabled,
    isCard = false,
    applyDisabledStyle = true,
    withHitSlop,
    button = 'normal',
    underlayColor = colors.grayM6
  } = props
  if (hide) return null

  const [animatedScale] = useState(new Animated.Value(1))

  const toggleAnimatedScale = (toValue: number) => {
    Animated.timing(animatedScale, {
      toValue,
      duration: 100,
      useNativeDriver: true
    }).start()
  }

  const disabledStyle = applyDisabledStyle && disabled && {opacity: 0.6}
  const styles = [isCard && style.card, disabledStyle, props.style]
  const animatedStyle = [
    {transform: [{scale: animatedScale}]},
    props.containerStyle
  ]
  const onPress = () => !props?.disableAction && props?.onPress?.()

  const buttons = {
    normal: TouchableOpacity,
    highlight: TouchableHighlight
  }

  let ActionButton = buttons[button as keyof typeof buttons]
  return (
    <Animated.View style={animatedStyle}>
      <ActionButton
        activeOpacity={activeOpacity}
        onLongPress={() => toggleAnimatedScale(1)}
        onPressIn={() => toggleAnimatedScale(props?.scale ?? 0.98)}
        onPressOut={() => toggleAnimatedScale(1)}
        {...(withHitSlop && {
          hitSlop: hitSlop(20)
        })}
        {...(button === 'highlight' && {underlayColor})}
        {...props}
        onPress={onPress}
        style={styles}>
        {props.children}
      </ActionButton>
    </Animated.View>
  )
}

ButtonView.defaultProps = {
  hide: false,
  button: 'normal'
}

const style = StyleSheet.create({
  card: {
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowColor: colors.grayM9,
    backgroundColor: 'white',
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 10,
    alignSelf: 'center'
  }
})
