import {createSlice} from "@reduxjs/toolkit";

interface sliceState {
  messages: { [key: string]: any },
  timeline: { [key: string]: any },
}

const initialState: sliceState = {
  messages: {},
  timeline: {},
}

export const flashSlice = createSlice({
  name: 'userSlice',

  initialState,

  reducers: {
    setFlash(state, {payload}) {
      state.messages[payload.key] = payload.value
      state.timeline[payload.key] = payload.timeline
    },

    resetFlash(state, {payload}) {
      delete state.messages[payload]
      delete state.timeline[payload]
    }
  }
})

export default flashSlice.reducer

export const {setFlash, resetFlash} = flashSlice.actions
