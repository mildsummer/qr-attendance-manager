import { auth } from "./firebase";
import { onStateChange, createToken, getUser } from "./actions";

export const setupAuthStateHandler = store => {
  auth.onAuthStateChanged(user => {
    const current = store.getState().auth.data;
    store.dispatch(onStateChange(user));
    if (!current && user) {
      store.dispatch(getUser(user.uid));
      store.dispatch(createToken());
    }
  });
};
