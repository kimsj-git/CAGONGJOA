// modal 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"

const initialModalState = {
  openCafeAuthModal: false,
  openNearCafeList: false,
  openConfirmCafe: false,
  selectedCafe: {}
}

const modalSlice = createSlice({
  name: "modal",
  initialState: initialModalState,
  reducers: {
    toggleCafeAuthModal(state) {
      state.openCafeAuthModal = !state.openCafeAuthModal
    },
    toggleNearCafeListModal(state) {
      state.openNearCafeList = !state.openNearCafeList
    },
    toggleConfirmCafeModal(state,actions) {
      state.openConfirmCafe = !state.openConfirmCafe
      state.selectedCafe = actions.payload
    },
  },
})



export const modalActions = modalSlice.actions

export default modalSlice.reducer
