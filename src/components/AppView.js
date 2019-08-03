import React, { Fragment } from 'react'
import { StatusBar, View } from 'react-native'
import { compose, lifecycle, setDisplayName } from 'recompose'
import { Platform, UIManager } from 'react-native'

import Navigator from 'Navigation/NavigatorView'

const AppView = () => {
  return (
    <Fragment>
      <View>
        <StatusBar backgroundColor='transparent' barStyle='light-content' />
      </View>
      <Navigator onNavigationStateChange={() => {}} uriPrefix="/app" />
    </Fragment>
  )
}

export default compose(
  setDisplayName('AppView'),
  lifecycle({
    componentDidMount() {
      if (Platform.OS === 'android') {
        // eslint-disable-next-line no-unused-expressions
        UIManager.setLayoutAnimationEnabledExperimental &&
          UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    },
    componentDidUpdate(prevProps) {
      const { initApp, bootstrapped } = this.props
      if (prevProps.bootstrapped !== bootstrapped && bootstrapped) {
        initApp()
      }
    }
  }),
)(AppView)