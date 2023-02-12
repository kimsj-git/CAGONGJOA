// search 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"

const initialSearchState = {
  searchedPosts: [],
  searchedUsers: [],
  hasSearched: [false, false],
  isLoading: false,
}

const searchSlice = createSlice({
  name: "search",
  initialState: initialSearchState,
  reducers: {
    keywordChange(state, action) {
      state.hasSearched = [true, false]
      state.searchedPosts = [...action.payloadt]
    },
    domainChange(state, action) {
      action.payload.searchType
        ? (state.searchedUsers = [...action.payload.result])
        : (state.searchedPosts = [...action.payload.result])
      state.hasSearched[action.payload.searchType] = true
    },

    isLoading(state) {
      state.isLoading = !state.isLoading
    },
  },
})

export const searchActions = searchSlice.actions

export default searchSlice.reducer
