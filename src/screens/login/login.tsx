import {StyleSheet, View} from 'react-native'
import {BaseButton, BaseImage, BaseInput, Text} from 'components'
import {useNavigation} from '@react-navigation/native'
import {routes} from 'navigation'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  setConversationId,
  setInitialParams,
  setMessages,
  setUserData
} from 'store/common/slice'
import {RootState} from 'store'
import {NurseView} from 'components/common'

const Login = () => {
  const dispatch = useDispatch()
  const {conversationId} = useSelector((state: RootState) => state.common)
  const navigation = useNavigation()
  const [email, setEmail] = useState(conversationId ?? '')
  const [password, setPassword] = useState('')
  const login = () => {
    if (email !== conversationId) {
      dispatch(setConversationId(email))
      dispatch(setUserData(null))
      dispatch(setInitialParams(null))
      dispatch(setMessages([]))
    } else {
    }
    navigation.navigate(routes.WELCOME)
  }
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <BaseImage type="Image" className="w-full h-full absolute" name="BG" />
      <NurseView />
      <View
        style={styles.card}
        className="w-11/12 bg-white rounded-3xl py-12 items-center justify-center border border-gray-200">
        <Text
          className="font-bold text-2xl text-gray-700 mb-6"
          text="Login to Get Started"
        />
        <BaseInput value={email} label="Email" onChangeText={setEmail} />
        <BaseInput
          value={password}
          label="Password"
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>
      <BaseButton title="Login" onPress={login} />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5
  }
})
export default Login
