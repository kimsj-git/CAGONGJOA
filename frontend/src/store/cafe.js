// cafe 관련 상태관리
import { createSlice } from "@reduxjs/toolkit"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL
const initialCafeState = { nearCafe: [], isCafeListLoading:false, mapCafeList: [] }

const cafeSlice = createSlice({
  name: "cafe",
  initialState: initialCafeState,
  reducers: {
    cafeListLoading(state){
      state.isCafeListLoading = !state.isCafeListLoading
    },
    replaceNearCafe(state, actions) {
      state.nearCafe = actions.payload
    },
    replaceMapCafeList(state,actions){
      state.mapCafeList = actions.payload
    }
  },
})

export const findNearCafeData = () => {
  return async (dispatch) => {
    dispatch(cafeActions.cafeListLoading())
    const sendRequest = async () => {
      const response = await fetch(`${REST_DEFAULT_URL}/cafe/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          latitude: sessionStorage.getItem("lat"),
          longitude: sessionStorage.getItem("lng"),
        }),
      })

      if (!response.ok) {
        throw new Error("fetch error")
      }
      const data = await response.json()
      return data.data
    }
    try {
      const cafeData = await sendRequest()
      console.log(cafeData)
      dispatch(cafeActions.replaceNearCafe(cafeData))
    } catch (error) {
      console.error(error)
    }
    dispatch(cafeActions.cafeListLoading())
  }
}

export const findMapCafeList = (dataSet) => {
  return async (dispatch) => {
    dispatch(cafeActions.cafeListLoading())
    const sendRequest = async () => {
      const response = await fetch(`${REST_DEFAULT_URL}/cafe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          latitude: dataSet.lat,
          longitude: dataSet.lng,
          dist: dataSet.distance,
        }),
      })

      if (!response.ok) {
        throw new Error("fetch error")
      }
      const data = await response.json()
      return data.data
    }
    try {
      const cafeData = await sendRequest()
      dispatch(cafeActions.replaceMapCafeList(cafeData))
    } catch (error) {
      console.error(error)
    }
    dispatch(cafeActions.cafeListLoading())
  }
}

export const cafeActions = cafeSlice.actions

export default cafeSlice.reducer
