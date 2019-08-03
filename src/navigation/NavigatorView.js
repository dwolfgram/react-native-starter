import React from 'react';
import AppNavigator from './StackNavigator'
import { compose } from 'recompose'

const NavigatorView = () => {
  return <AppNavigator />
}

export default compose(
)(NavigatorView)

