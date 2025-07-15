import {createStackNavigator} from '@react-navigation/stack'
import {routes} from '../navigation-routes'
import {Login} from 'screens/login'
import Welcome from '../../screens/welcome/welcome'
import {Chat} from 'screens/chat'
import {Conversation} from 'screens/conversation'

const Stack = createStackNavigator()

export const CommonNavigator = (
  <Stack.Group>
    <Stack.Screen name={routes.LOGIN} component={Login} />
    <Stack.Screen name={routes.WELCOME} component={Welcome} />
    <Stack.Screen name={routes.CHAT} component={Chat} />
    <Stack.Screen name={routes.CONVERSATION} component={Conversation} />
  </Stack.Group>
)
