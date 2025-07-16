import {BaseImage} from 'components/base'
import {View} from 'react-native'
import {SCREEN_WIDTH} from 'utils/size'

export const NurseView = props => {
  return (
    <View
      style={[
        {
          width: SCREEN_WIDTH * 0.57,
          height: SCREEN_WIDTH * 0.57,
          alignItems: 'center',
          justifyContent: 'center'
        },
        props.style
      ]}>
      <BaseImage
        name="circle_animated"
        style={{
          position: 'absolute',
          width: SCREEN_WIDTH * 0.57,
          height: SCREEN_WIDTH * 0.57
        }}
      />
      <BaseImage
        name="nurse"
        style={{
          width: SCREEN_WIDTH * 0.45,
          height: SCREEN_WIDTH * 0.45
        }}
      />
    </View>
  )
}
