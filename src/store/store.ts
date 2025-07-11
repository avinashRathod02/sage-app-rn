import AsyncStorage from '@react-native-async-storage/async-storage'
import {configureStore} from '@reduxjs/toolkit'
import {persistReducer, persistStore} from 'redux-persist'
import rootReducer from './reducers'
import {useDispatch} from 'react-redux'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
})

export let persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
