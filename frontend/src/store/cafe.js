// cafe 관련 상태관리
import { createSlice } from "@reduxjs/toolkit"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL
const initialCafeState = { nearCafe: [], isCafeListLoading:false }

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
  },
})

export const findNearCafeData = () => {
  return async (dispatch) => {
    dispatch(cafeActions.cafeListLoading())
    const sendRequest = async () => {
      const response = await fetch(`${REST_DEFAULT_URL}/cafeAuth/check`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: {
          latitude: sessionStorage.getItem("lat"),
          longitude: sessionStorage.getItem("lng"),
        },
      })

      if (!response.ok) {
        throw new Error("fetch error")
      }

      const data = await response.json()
      
      return data
    }
    try {
      const cafeData = await sendRequest()
      dispatch(cafeActions.replaceNearCafe(cafeData))
    } catch (error) {
      console.log(error)
    }
    dispatch(cafeActions.cafeListLoading())
  }
}

export const cafeActions = cafeSlice.actions

export default cafeSlice.reducer
