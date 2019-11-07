import { refreshToken, getUser } from "./actions";

export const setupAuthStateHandler = ({ auth, db, store }) => {
  auth.onAuthStateChanged(user => {
    console.log("auth state changed", user);
    const current = store.getState().auth.data;
    store.dispatch({
      type: "AUTH_STATE_CHANGED",
      data: user
    });
    if (!current && user) {
      store.dispatch(getUser(user.uid));
      store.dispatch(refreshToken());
    }
  });
};
