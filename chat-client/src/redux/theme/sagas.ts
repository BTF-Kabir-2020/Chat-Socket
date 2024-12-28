/* eslint-disable require-yield */
import { takeEvery } from "redux-saga/effects";
import { SET_THEME } from "./types";

function* saveThemeToLocalStorage(action: any) {
  try {
    localStorage.setItem("theme", action.payload); // ذخیره تم در localStorage
  } catch (e) {
    console.error("Error saving theme to localStorage", e);
  }
}

function* themeSaga() {
  yield takeEvery(SET_THEME, saveThemeToLocalStorage); // نظارت بر تغییرات تم
}

export default themeSaga;
/* eslint-enable require-yield */
