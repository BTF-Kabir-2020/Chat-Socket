import { SET_THEME } from "./types";

const initialState = {
  theme: "darklite", // پیش‌فرض تم رو به روشن است
};

const themeReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_THEME:
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

export default themeReducer;
