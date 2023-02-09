// studyHistory 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL
const initialStudyHistoryState = {
  year: 0,
  month: 0,
  day: 0,
  isLoading: false,
  studyDetail: [],
}

const studyHistorySlice = createSlice({
  name: "studyHistory",
  initialState: initialStudyHistoryState,
  reducers: {
    selectDay(state, actions) {
      state.year = actions.payload.year
      state.month = actions.payload.month
      state.day = actions.payload.day
    },
    getStudyDetail(state, actions){
      state.studyDetail = actions.payload
    },
    toggleLoading(state){
      state.isLoading = !state.isLoading
    }
  },
})

export const getStudyDetails = (dataSet) => {
  return async (dispatch) => {
    dispatch(studyHistoryActions.toggleLoading())
    const sendRequest = async () => {
      const response = await fetch(
        `${REST_DEFAULT_URL}/myPage/cafeLive?todayDate=${dataSet.year}${dataSet.month}${dataSet.day}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      )
      if (response.status === 401){
        const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`,{
          method: "GET",
          headers: {
            "Authorization" : `Bearer ${sessionStorage.getItem('refreshToken')}`
          }
        })
        if (!response.ok){
          throw new Error('Failed refresh')
        }
        const data = await response.json()
        sessionStorage.setItem('accessToken', data.jwt.accessToken)
        sendRequest(dataSet)
      }
      const data = await response.json()
      return data.data
    }
    try {
      const studyData = await sendRequest()
      dispatch(studyHistoryActions.getStudyDetail(studyData))
      }catch (error) {
      console.error(error)
    }
    dispatch(studyHistoryActions.toggleLoading())
  }
}

export const studyHistoryActions = studyHistorySlice.actions

export default studyHistorySlice.reducer
