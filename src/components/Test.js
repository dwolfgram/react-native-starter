import React from 'react'
import { View, Text } from 'react-native'
import { compose, setDisplayName } from 'recompose'

const Test = () => {
  return (
    <View>
      <Text>Hellooooo World!</Text>
    </View>
  )
}

export default compose(
  setDisplayName('Test'),
)(Test)