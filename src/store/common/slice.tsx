import {createSlice} from '@reduxjs/toolkit'
import {IInitialCommonStateProps} from './types'

const initialState: IInitialCommonStateProps = {
  initialParams: null,
  userData: null,
  categories: []
}

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setInitialParams: (state, action) => {
      state.initialParams = action.payload
    },
    updateInitialParams: (state, action) => {
      state.initialParams = {
        ...state.initialParams,
        ...action.payload
      }
    }
  }
})

export const {
  setCategories,
  setUserData,
  setInitialParams,
  updateInitialParams
} = commonSlice.actions

export default commonSlice.reducer
