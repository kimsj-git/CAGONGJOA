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
    openCafeAuthModal(state) {
      state.openCafeAuthModal = true
    },
    closeCafeAuthModal(state) {
      state.openCafeAuthModal = false
    },
    toggleNearCafeListModal(state) {
      state.openNearCafeList = !state.openNearCafeList
    },
    toggleConfirmCafeModal(state,actions) {
      state.openConfirmCafe = !state.openConfirmCafe
      state.selectedCafe = actions.payload
    },
    closeConfirmCafeModal(state) {
      state.openConfirmCafe = false
    }
  },
})



export const modalActions = modalSlice.actions

export default modalSlice.reducer
