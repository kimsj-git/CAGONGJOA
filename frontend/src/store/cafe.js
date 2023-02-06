// cafe 관련 상태관리
import { createSlice } from "@reduxjs/toolkit"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL
const initialCafeState = {
  nearCafe: [],
  isCafeListLoading: false,
  mapCafeList: [],
  mapCafeFilterList: [],
  cafeBrandFilterList: [],
  isFiltered: false,
  selectedBrand: "",
}

const cafeSlice = createSlice({
  name: "cafe",
  initialState: initialCafeState,
  reducers: {
    cafeListLoading(state) {
      state.isCafeListLoading = !state.isCafeListLoading
    },
    replaceNearCafe(state, actions) {
      state.nearCafe = actions.payload
    },
    replaceMapCafeList(state, actions) {
      state.mapCafeList = actions.payload
    },
    replaceCafeFilterList(state, actions) {
      state.mapCafeFilterList = actions.payload
    },
    replaceCafeBrandList(state, actions) {
      state.cafeBrandFilterList = actions.payload
    },
    findCafeList(state) {
      state.mapCafeFilterList = []
      state.isFiltered = false
      state.selectedBrand = ""
    },
    filterCafeList(state, actions) {
      if (state.isFiltered && state.selectedBrand === actions.payload.brand) {
        state.mapCafeFilterList = []
        state.isFiltered = false
        state.selectedBrand = ""
      } else {
        state.isFiltered = true
        state.selectedBrand = actions.payload.brand
        state.mapCafeFilterList = state.mapCafeList.filter((cafe) => {
          return cafe.brand_type === actions.payload.brand
        })
      }
    },
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
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          latitude: JSON.parse(sessionStorage.getItem("location")).lat,
          longitude: JSON.parse(sessionStorage.getItem("location")).lng,
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
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
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
      let cafeFilterList = []
      for (const cafe of cafeData) {
        if (cafeFilterList.indexOf(cafe.brand_type) === -1) {
          cafeFilterList = [...cafeFilterList, cafe.brand_type]
        }
      }
      dispatch(cafeActions.replaceCafeBrandList(cafeFilterList))
    } catch (error) {
      console.error(error)
    }
    dispatch(cafeActions.cafeListLoading())
  }
}

export const cafeActions = cafeSlice.actions

export default cafeSlice.reducer
