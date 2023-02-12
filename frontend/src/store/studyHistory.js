// studyHistory 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL
const initialStudyHistoryState = {
  year: 0,
  month: 0,
  day: 0,
  isLoading: false,
  monthStudyHistory: [],
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
    getMonthStudyHistory(state, actions) {
      state.monthStudyHistory = actions.payload
    },
    toggleLoading(state) {
      state.isLoading = !state.isLoading
    },
  },
})

export const getMonthStudyHistory = (dataSet) => {
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
      const responseData = await response.json()
      if (
        responseData.httpStatus === "BAD_REQUEST" &&
        responseData.data.sign === "JWT"
      ) {
        const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`, {
          method: "GET",
          headers: {
            "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
              "refreshToken"
            )}`,
          },
        })
        const responseData = await response.json()
        if (!responseData.httpStatus === "OK") {
          sessionStorage.clear()
        }else{
          sessionStorage.setItem("accessToken", responseData.data.accessToken)
          sendRequest(dataSet)
        }
      }else if (responseData.httpStatus === "OK"){
        return responseData.data
      }
    }
    try {
      const studyData = await sendRequest()
      dispatch(studyHistoryActions.getMonthStudyHistory(studyData))
    } catch (error) {
      console.error(error)
    }
    dispatch(studyHistoryActions.toggleLoading())
  }
}

export const studyHistoryActions = studyHistorySlice.actions

export default studyHistorySlice.reducer
