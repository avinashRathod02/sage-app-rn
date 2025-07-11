import {createStackNavigator} from '@react-navigation/stack'
import {routes} from '../navigation-routes'
import {Login} from 'screens/login'
import Welcome from '../../screens/welcome/welcome';

const Stack = createStackNavigator()

export const CommonNavigator = (
  <Stack.Group>
    <Stack.Screen name={routes.LOGIN} component={Login} />
    <Stack.Screen name={routes.WELCOME} component={Welcome} />
  </Stack.Group>
)
