import Cookies from 'js-cookie';
import {User} from '~/contracts/schema';
import {createSlice} from '@reduxjs/toolkit';

const initialState: { token: string, user: User } = {
  token: Cookies.get('token') ?? null,

  user: {} as User,
}
export const authSlice = createSlice({
  name: 'authSlice',

  initialState,

  reducers: {
    setAuthToken(state, {payload}) {
      state.token = payload ?? null

      Cookies.set('token', state.token)

      if (payload === null) {
        Cookies.remove('token')
      }
    },

    setUser(state, {payload}) {
      state.user = payload ?? {}
    }
  }
})

export default authSlice.reducer


export const {setAuthToken, setUser} = authSlice.actions
