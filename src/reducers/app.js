import { createReducer } from 'redux-act'
import { appReady, appError } from 'Actions/app'

export const initialState = {
  error: '',
  ready: false,
  newUser: true
}

export default createReducer({
  [appReady]: (state, ready) => ({ ...state, ready, error: '' }),
  [appError]: (state, error) => ({ ...state, error: error.message || error }),
  //[createNewUser]: (state) => ({ ...state, newUser: false }),
}, initialState)
