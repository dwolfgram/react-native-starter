import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from 'Src/reducers/store'

import AppView from 'Components/AppView'

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppView />
        </PersistGate>
      </Provider>
    )
  }
}
