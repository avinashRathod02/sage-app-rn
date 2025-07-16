import {StyleSheet, View} from 'react-native'
import {BaseButton} from 'components/base'
import {AssetSvg} from 'components/asset-svg'

interface IProps {
  title: string
  showLines?: boolean
  showEdit?: boolean
}
export const Header = (props: IProps) => {
  const {title, showLines = true, showEdit = false} = props
  return (
    <View className="mt-14 flex-row items-center justify-between">
      {showLines && <View style={styles.line} />}
      {showEdit && <View className="w-10" />}
      <BaseButton scale={1} style={{width: 'auto'}} title={title} />
      {showLines && <View style={styles.line} />}
      {showEdit && <AssetSvg name="edit" className="mr-5" />}
    </View>
  )
}

const styles = StyleSheet.create({
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#BADDF0'
  }
})
