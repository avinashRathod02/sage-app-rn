import {NativeModules} from 'react-native'
import Reactotron from 'reactotron-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {isIosPlatform} from 'utils'

let scriptHostname = 'localhost'
if (__DEV__) {
  const scriptURL = NativeModules.SourceCode.scriptURL
}

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({name: 'SageApp', host: scriptHostname}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!

export default reactotron
