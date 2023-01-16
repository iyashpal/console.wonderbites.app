import Cookies from 'js-cookie'
import {createSlice} from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: 'auth',

  initialState: {
    token: Cookies.get('token') ?? null
  },

  reducers: {
    setAuthToken(state, {payload}) {
      state.token = payload
      Cookies.set('token', payload)
    }
  }
})

export default authSlice.reducer


export const {setAuthToken} = authSlice.actions
