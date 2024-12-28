import { SET_THEME } from "./types";

export const setTheme = (theme: string) => ({
  type: SET_THEME,
  payload: theme,
});
