import {BackIcon, CrossIcon, EditIcon, LoginIcon, SaveIcon} from 'assets/svgs'

export const ASSET_SVGS = {
  back: BackIcon,
  cross: CrossIcon,
  edit: EditIcon,
  login: LoginIcon,
  save: SaveIcon
}

export type SvgType = keyof typeof ASSET_SVGS
