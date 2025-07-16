import {
  BackIcon,
  CrossIcon,
  DateIcon,
  DownIcon,
  EditIcon,
  LoginIcon,
  SaveIcon
} from 'assets/svgs'

export const ASSET_SVGS = {
  back: BackIcon,
  cross: CrossIcon,
  edit: EditIcon,
  login: LoginIcon,
  save: SaveIcon,
  date: DateIcon,
  down: DownIcon
}

export type SvgType = keyof typeof ASSET_SVGS
