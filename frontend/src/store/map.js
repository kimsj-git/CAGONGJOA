// auth 관련 상태관리

import { createSlice } from "@reduxjs/toolkit";

const initialMapState = { lat: 0, lng:0 }

const mapSlice = createSlice({
  name: "map",
  initialState: initialMapState,
  reducers: {
    center(state, actions){
      state.lat = actions.payload.lat
      state.lng = actions.payload.lng
    }
  }
})

export const mapActions = mapSlice.actions

export default mapSlice.reducer