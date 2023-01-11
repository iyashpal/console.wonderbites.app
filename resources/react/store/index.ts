import {configureStore} from '@reduxjs/toolkit'

const Store = configureStore({
  reducer: {}
})

export default Store

export type StoreDispatch = typeof Store.dispatch
export type RootState = ReturnType<typeof Store.getState>
