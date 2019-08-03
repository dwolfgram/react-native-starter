import { combineReducers } from 'redux'

import App from 'Reducers/app'

const rehydrated = (state = false, action = {}) => {
  switch (action.type) {
    case 'persist/REHYDRATE':
      return true
    default:
      return state
  }
}

export default combineReducers({
  rehydrated,
  App,
})
