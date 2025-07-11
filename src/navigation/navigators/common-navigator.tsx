import {createStackNavigator} from '@react-navigation/stack'
import {routes} from '../navigation-routes'
import {AboutUs} from 'screens/about-us'

const Stack = createStackNavigator()

export const CommonNavigator = (
  <Stack.Group>
    <Stack.Screen name={routes.ABOUT_US} component={AboutUs} />
  </Stack.Group>
)
