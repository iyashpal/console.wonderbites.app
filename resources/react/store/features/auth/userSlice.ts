import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: 'userSlice',

  initialState: {
    user: {}
  },

  reducers: {
    setUser(state, {payload}) {
      state.user = payload ?? {}
    }
  }
})

export default userSlice.reducer

export const {setUser} = userSlice.actions
