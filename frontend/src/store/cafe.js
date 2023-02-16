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
  isFindFeed: false,
  brandLogo : {
    할리스: "hollys",
    폴바셋: "paulbasset",
    파스쿠찌: "pascucci",
    투썸플레이스: "twosome",
    토프레소: "topresso",
    텐퍼센트커피: "tenpercent",
    탐앤탐스: "tomntoms",
    컴포즈커피: "compose",
    커피에반하다: "coffeebanada",
    커피스미스: "coffeesmith",
    커피빈: "coffeebean",
    커피베이: "coffeebay",
    커피나무: "coffeenamu",
    카페베네: "caffeebene",
    카페띠아모: "caffetiamo",
    전광수: "jungwang",
    이디야커피: "edia",
    요거프레소: "yogerpresso",
    엔제리너스: "angelinus",
    스타벅스: "starbucks",
    스무디킹: "smoothy",
    셀렉토커피: "selecto",
    빽다방: "paiksdabang",
    베스킨라빈스: "baskin",
    메가커피: "megacoffee",
    매머드: "mammoth",
    드롭탑: "droptop",
    더벤티: "theventi",
    달콤커피: "dalkomm",
    나우커피: "nowcoffee",
    공차: "gongcha",
    개인카페: "selfcafe",
    바나프레소: "banapresso",
  }
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
    findFeed(state) {
      state.isFindFeed = true
    },
    findFeedMyLocation(state) {
      state.isFindFeed = false
    },
  },
})
//refresh 토큰 보내는 로직 구현 추가해야함
export const findNearCafeData = (location) => {
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
          latitude: location.lat,
          longitude: location.lng
        }),
      })
      const responseData = await response.json()
      if (responseData.httpStatus === "OK") {
        return responseData.data
      } else if (
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
          sessionStorage.setItem("accessToken", responseData.data.accessToken)
          sendRequest()
        } else {
          sessionStorage.clear()
        }
      }
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

export const findCafeList = (dataSet) => {
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
      const responseData = await response.json()
      if (responseData.httpStatus === "OK") {
        return responseData.data
      }
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
  const date = new Date()
  const TIME_ZONE = 3240 * 10000
  const sendDate = new Date(+date + TIME_ZONE).toISOString().substr(0, 19)

  return async (dispatch) => {
    dispatch(cafeActions.cafeListLoading())
    const sendRequest = async () => {
      const response = await fetch(`${REST_DEFAULT_URL}/cafe/crowd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          latitude: dataSet.lat,
          longitude: dataSet.lng,
          dist: dataSet.distance,
          todayTime: sendDate,
        }),
      })
      console.log(response)
      const responseData = await response.json()
      console.log(responseData)
      if (responseData.httpStatus === "OK") {
        return responseData.data
      }
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
