import {View} from 'react-native'
import {BaseButton, BaseImage, ButtonView, Text} from 'components'
import {useNavigation} from '@react-navigation/native'
import {routes} from 'navigation'

const Welcome = () => {
  const navigation = useNavigation()
  const login = () => navigation.navigate(routes.WELCOME)
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <BaseImage type="Image" className="w-full h-full absolute" name="BG" />
      <Text className="font-bold" text="Welcome" />
      <BaseButton title="Continue" onPress={login} />
      <ButtonView className="mt-4 rounded-full overflow-hidden">
        <BaseImage name="wave_animated" style={{width: 100, height: 100}} />
      </ButtonView>
    </View>
  )
}

export default Welcome
