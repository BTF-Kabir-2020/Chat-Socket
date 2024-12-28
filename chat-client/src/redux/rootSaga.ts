// src\redux\rootSaga.ts
import { all } from "redux-saga/effects";
import themeSaga from "./theme/sagas";

export default function* rootSaga() {
  yield all([themeSaga()]);
}
