import {ASSET_IMAGES} from 'assets/images/index'
import {ImageProps} from 'react-native'
import t from 'locales/use-translation'
import {ImageComponents} from './base-image'

export interface IProps extends ImageProps {
  /**
   * Handle the image will render or not.
   * @default false
   */
  hide?: boolean

  /**
   * Name of the image
   */
  name?: AssetImageName

  type?: keyof typeof ImageComponents
}

export type AssetImageName = keyof typeof ASSET_IMAGES
