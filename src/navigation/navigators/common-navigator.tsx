import {createStackNavigator} from '@react-navigation/stack'
import {routes} from '../navigation-routes'
import {Login} from 'screens/login'
import Welcome from '../../screens/welcome/welcome'
import {Chat} from 'screens/chat'
import {PatientSummary} from 'screens/patient-summary'
import {PatientDataEdit} from 'screens/patient-data-edit'

const Stack = createStackNavigator()

export const CommonNavigator = (
  <Stack.Group>
    <Stack.Screen name={routes.LOGIN} component={Login} />
    <Stack.Screen name={routes.WELCOME} component={Welcome} />
    <Stack.Screen name={routes.CHAT} component={Chat} />
    <Stack.Screen name={routes.PATIENT_SUMMARY} component={PatientSummary} />
    <Stack.Screen name={routes.PATIENT_DATA_EDIT} component={PatientDataEdit} />
  </Stack.Group>
)
