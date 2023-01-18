import {configureStore} from '@reduxjs/toolkit'
import * as features from './features'

const Store = configureStore({
  reducer: {
    authSlice: features.authSlice,
    userSlice: features.userSlice,
  }
})

export default Store

export type StoreDispatch = typeof Store.dispatch
export type RootState = ReturnType<typeof Store.getState>
