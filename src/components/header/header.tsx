import {StyleSheet, View} from 'react-native'
import {BaseButton} from 'components/base'

export const Header = props => {
  const {title} = props
  return (
    <View className="mt-14 flex-row items-center justify-between">
      <View style={styles.line} />
      <BaseButton scale={1} style={{width: 'auto'}} title={title} />
      <View style={styles.line} />
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
