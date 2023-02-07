// post 관련 상태관리

import { createSlice } from "@reduxjs/toolkit";

const initialPostState = { uploadedImage:[] }

const postSlice = createSlice({
  name: "post",
  initialState: initialPostState,
  reducers: {
    uploadImage(state, actions){
      state.uploadedImage = [...state.uploadedImage, actions.payload]
    },
    closeModal(state){
      state.uploadedImage = []
    },
    handleFiles(state, actions){
      state.uploadedImage = [...state.uploadedImage, actions.payload].slice(0,10)
    },
    removeImage(state, actions){
      state.uploadedImage = state.uploadedImage.filter((img, index)=> !(index===actions.payload))
    },
  }
})

export const postActions = postSlice.actions

export default postSlice.reducer