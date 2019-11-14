import { NavigationActions } from "react-navigation";

let _navigator;

function navigate(config) {
  _navigator.dispatch(NavigationActions.navigate(config));
}

export function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

const NavigateMiddleware = store => next => action => {
  next(action);
  if (action.navigate) {
    if (_navigator) {
      if (typeof action.navigate === "string") {
        navigate({ routeName: action.navigate });
      } else {
        navigate(action.navigate);
      }
    } else {
      setTimeout(() => {
        NavigateMiddleware(store)(next)(action);
      });
    }
  }
};

export default NavigateMiddleware;
