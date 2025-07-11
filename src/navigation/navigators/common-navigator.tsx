import {createStackNavigator} from '@react-navigation/stack'
import {routes} from '../navigation-routes'
import {Login} from 'screens/login'

const Stack = createStackNavigator()

export const CommonNavigator = (
  <Stack.Group>
    <Stack.Screen name={routes.LOGIN} component={Login} />
  </Stack.Group>
)
