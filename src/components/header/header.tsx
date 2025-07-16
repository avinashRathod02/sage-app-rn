import { View, Text } from 'react-native'
import React from 'react'
import { BaseButton } from 'components/base'

export default (props) => {
     const { title } = props
  return (
    <View>
     <BaseButton title={title} />
    </View>
  )
}

 