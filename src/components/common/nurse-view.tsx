import {BaseImage} from 'components/base'
import {View} from 'react-native'
import {SCREEN_WIDTH} from 'utils/size'

export const NurseView = () => {
  return (
    <View
      style={{
        width: SCREEN_WIDTH * 0.7,
        height: SCREEN_WIDTH * 0.7,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <BaseImage
        name="circle_animated"
        style={{
          position: 'absolute',
          width: SCREEN_WIDTH * 0.7,
          height: SCREEN_WIDTH * 0.7
        }}
      />
      <BaseImage
        name="nurse"
        style={{
          width: SCREEN_WIDTH * 0.57,
          height: SCREEN_WIDTH * 0.57
        }}
      />
    </View>
  )
}
