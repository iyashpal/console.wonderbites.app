import Cookies from 'js-cookie'
import {createSlice} from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: 'authSlice',

  initialState: {
    token: Cookies.get('token') ?? null,

    user: {}
  },

  reducers: {
    setAuthToken(state, {payload}) {
      state.token = payload ?? null

      Cookies.set('token', state.token)

      if (payload === null) {
        Cookies.remove('token')
      }
    },

    setUser(state, { payload }) {
      state.user = payload ?? {}
    }
  }
})

export default authSlice.reducer


export const {setAuthToken, setUser} = authSlice.actions
