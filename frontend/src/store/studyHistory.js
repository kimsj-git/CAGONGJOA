// studyHistory 관련 상태관리

import { createSlice } from "@reduxjs/toolkit";

const initialStudyHistoryState = { year: 0, month:0, day:0 }

const studyHistorySlice = createSlice({
  name: "studyHistory",
  initialState: initialStudyHistoryState,
  reducers: {
    selectDay(state, actions){
      state.year = actions.payload.year
      state.month = actions.payload.month
      state.day = actions.payload.day
    }
  }
})

export const studyHistoryActions = studyHistorySlice.actions

export default studyHistorySlice.reducer