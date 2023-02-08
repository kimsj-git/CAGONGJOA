// 모든 상태관리를 맡을 Redux

import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import modalReducer from "./modal";
import timerReducer from "./timer";
import cafeReducer from "./cafe";
import todoReducer from "./todo";
import studyHistoryReducer from "./studyHistory";
import imageReducer from "./image";

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    timer: timerReducer,
    todo: todoReducer,
    cafe: cafeReducer,
    studyHistory: studyHistoryReducer,
    image: imageReducer,
  },
});

export default store;
