import {SvgXml} from 'react-native-svg'
import {View} from 'react-native'
import {ASSET_SVGS, SvgType} from './svg-icons'
import {AssetSvgProps} from './type.d'
import React = require('react')
import {ButtonView} from 'components/base'
import {hasValue} from 'utils/condition'

export const AssetSvg = (props: AssetSvgProps) => {
  const {size = 24} = props
  const {
    hide = false,
    preserveAspectRatio,
    name,
    fill = 'black',
    width = size,
    height = size,
    style,
    buttonViewProps,
    viewProps,
    containerStyle
  } = props
  const icon = ASSET_SVGS?.[name as SvgType] ?? null
  if (hide || !icon) return null
  const Container = buttonViewProps ? ButtonView : View

  return (
    <Container
      {...viewProps}
      {...buttonViewProps}
      style={[({pressed}) => [{opacity: pressed ? 0.5 : 1.0}], containerStyle]}>
      <SvgXml
        preserveAspectRatio={preserveAspectRatio}
        xml={icon(fill)}
        width={width}
        {...(hasValue(height) && {height})}
        style={style}
      />
    </Container>
  )
}
