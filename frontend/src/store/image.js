// image 관련 상태관리

import { createSlice } from "@reduxjs/toolkit";

const initialImageState = { uploadedImage: [] };

const imageSlice = createSlice({
  name: "image",
  initialState: initialImageState,
  reducers: {
    uploadImage(state, actions) {
      state.uploadedImage = [...state.uploadedImage, actions.payload];
    },
    closeModal(state) {
      state.uploadedImage = [];
    },
    handleFiles(state, actions) {
      state.uploadedImage = [...state.uploadedImage, actions.payload].slice(
        0,
        10
      );
    },
    removeImage(state, actions) {
      state.uploadedImage = state.uploadedImage.filter(
        (img, index) => !(index === actions.payload)
      );
    },
  },
});

export const imageActions = imageSlice.actions;

export default imageSlice.reducer;
