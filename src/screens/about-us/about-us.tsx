import {View} from 'react-native'
import styles from './styles'

import {MyAccountLayout} from '../../../components/my-account-layout'
import {TaskBox} from 'components/common'
import {useSelector} from 'react-redux'
import {RootState} from 'store'
import {Text} from 'components'

const AboutUs = () => {
  return (
    <View>
      <Text text="About" />
    </View>
  )
}

export default AboutUs
