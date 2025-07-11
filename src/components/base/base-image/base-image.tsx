import {AssetImageName, IProps} from './type.d'
import {ASSET_IMAGES} from 'assets/images'
import {Image} from 'react-native'
import FastImage from 'react-native-fast-image'

export const ImageComponents = {
  FastImage,
  Image
}

export const BaseImage = (props: IProps) => {
  const {
    source,
    name,
    type = 'FastImage',
    hide = false,
    resizeMode = 'contain'
  } = props
  if (hide) return null

  const image = ASSET_IMAGES?.[name as AssetImageName]
  const ImageComponent = ImageComponents[type]
  return (
    <ImageComponent
      source={source ? source : image}
      resizeMode={resizeMode}
      fadeDuration={1}
      {...props}
    />
  )
}
