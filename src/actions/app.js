import { newScopedCreateAction } from 'Utilities/action'

const createAction = newScopedCreateAction('src/actions/app.js')

export const appReady = createAction('READY')
export const appError = createAction('ERROR')
export const resetAll = createAction('RESET_ALL')
export const createNewUser = createAction('CREATE_NEW_USER')

export const loadApp = () => () => Promise.resolve()
  .then(() => console.log('app loaded'))

export const init = () => (dispatch) => Promise.resolve()
  .then(() => dispatch(loadApp))
  .then(() => { 
    console.log('app ready')
    return dispatch(appReady(true))
  })
  .catch((e) => {
    console.log(e)
    const message = e.message || 'Unknown error'
    dispatch(appError(message))
  })

export const createUser = () => (dispatch) => {
  dispatch(createNewUser())
  dispatch(init())
}