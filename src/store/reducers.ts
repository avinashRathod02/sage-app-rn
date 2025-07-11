import {AnyAction, combineReducers} from 'redux'
import commonSlice from './common/slice'

export const RESET_STATE = 'RESET_STATE'

const appReducer = combineReducers({
  common: commonSlice
})

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === RESET_STATE) {
    state = {
      common: undefined
    }
    setTimeout(() => {
      action?.payload?.()
    }, 500)
  }

  return appReducer(state, action)
}

export default rootReducer
