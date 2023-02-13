// search 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"

const initialSearchState = {
  searchedByPost: [],
  searchedByUser: [],
  hasSearched: [false, false],
  isLoading: false,
}

const searchSlice = createSlice({
  name: "search",
  initialState: initialSearchState,
  reducers: {
    searchByPost(state, action) {
      state.searchedByPost = [...action.payload]
      state.hasSearched = [true, false]
    },
    searchByUser(state, action) {
      state.searchedByUser = [...action.payload]
      state.hasSearched = [true, true]
    },

    loadMoreResults(state, action) {
      if (action.payload.type === 1) {
        state.searchedByPost = [
          ...state.searchedByPost,
          ...action.payload.result,
        ]
      } else if (action.payload.type === 2) {
        state.searchedByUsers = [
          ...state.searchedByUser,
          ...action.payload.result,
        ]
      }
    },

    isLoading(state) {
      state.isLoading = !state.isLoading
    },
  },
})

export const searchActions = searchSlice.actions

export default searchSlice.reducer
