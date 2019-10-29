import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Alert } from 'react-native';
import { Linking } from 'expo'
import { FIREBASE_AUTH_DOMAIN } from 'react-native-dotenv';
import { auth, db, functions } from './utils/firebase';
import { addChangeDateListener } from './utils/onChangeDate';

export const signIn = (email, password) => (dispatch) => {
  dispatch({
    type: 'START_AUTH_USER'
  });
  auth.signInWithEmailAndPassword(email, password)
    .catch(({ message}) => {
      dispatch({
        type: 'FAIL_AUTH_USER',
        message
      });
    });
};

export const authUser = (email, password) => (dispatch) => {
  dispatch({
    type: 'START_AUTH_USER'
  });
  auth.createUserWithEmailAndPassword(email, password)
    .catch(({ message }) => {
      dispatch({
        type: 'FAIL_AUTH_USER',
        message
      });
    });
};

export const sendPasswordResetEmail = (email) => () => {
  return auth.sendPasswordResetEmail(email)
};

export const verifyEmail = () => (dispatch) => {
  const user = store.getState().user.data;
  if (user) {
    Alert.alert(
      'Email verification',
      'We will send a verification link to your email account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            user.sendEmailVerification({ url: Linking.makeUrl(FIREBASE_AUTH_DOMAIN) }).then(() => {
              Alert.alert('The email has been sent.');
              db.collection('/users')
                .doc(user.uid)
                .onSnapshot((docSnapshot) => {
                  const dbUser = docSnapshot.data();
                  if (dbUser && dbUser.emailVerifiedAt) {
                    Alert.alert('Email verification has succeeded.');
                    dispatch({
                      type: 'SUCCESS_GET_USER',
                      data: dbUser
                    });
                    user.reload().then(() => {
                      console.log(user);
                    });
                  }
                });
            }).catch(function({ message }) {
              Alert.alert(message);
            });
          }
        },
      ]
    );
  }
};

export const sendName = (name) => (dispatch) => {
  const user = store.getState().user.data;
  return db.collection('/users')
    .doc(user.uid)
    .set({ name }, { merge: true })
    .then(() => {
      dispatch({
        type: 'SUCCESS_SEND_NAME',
        name
      });
      return true;
    });
};

export const handleScanned = (token) => (dispatch) => {
  const dbData = store.getState().user.dbData;
  dispatch({
    type: 'SEND_HISTORY',
    token
  });
  functions.httpsCallable('createHistory')({ token, guestName: dbData ? dbData.name : null })
    .then((result) => {
      dispatch({
        type: 'SEND_HISTORY_SUCCESS',
        data: result.data
      });
    })
    .catch(({ message }) => {
      Alert.alert(message);
      dispatch({
        type: 'SEND_HISTORY_FAIL'
      });
    })
};

export const confirmHistory = () => (dispatch) => {
  const user = store.getState().user.data;
  dispatch({
    type: 'CONFIRM_HISTORY'
  });
};

export const getHistory = (size, startAfter) => (dispatch) => {
  const user = store.getState().user.data;
  if (user) {
    let historyRef = db.collection('/users')
      .doc(user.uid)
      .collection('/history')
      .orderBy('createdAt')
      .limit(size);
    if (startAfter) {
      historyRef = historyRef.startAfter(startAfter);
    }
    historyRef.get()
      .then((querySnapshot) => {
        dispatch({
          type: 'SUCCESS_GET_HISTORY',
          data: querySnapshot.docs.map((docSnapshot) => (docSnapshot.data())),
          hasGetAll: querySnapshot.docs.length < size
        });
      })
      .catch(({ message }) => {
        Alert.alert(message);
      });
  }
};

export const refreshToken = () => (dispatch) => {
  dispatch({
    type: 'CREATE_TOKEN'
  });
  functions.httpsCallable('createToken')()
    .then((token) => {
      dispatch({
        type: 'CREATE_TOKEN_SUCCESS',
        token: token.data
      });
    })
    .catch(({ message }) => {
      Alert.alert(message);
      dispatch({
        type: 'CREATE_TOKEN_FAIL'
      });
    });
};

const INITIAL_STATE = {
  data: null,
  dbData: null,
  authError: null,
  history: null,
  hasGetAllHistory: false,
  phoneNumberConfirmation: null,
  isSendingHistory: false,
  sentHistory: null,
  historyLog: {},
  isCreatingToken: false
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'START_AUTH_USER':
      return { ...state, error: null };
    case 'SUCCESS_AUTH_USER':
      return { ...state, data: action.data };
    case 'SIGN_OUT_USER':
      return INITIAL_STATE;
    case 'FAIL_AUTH_USER':
      return { ...state, authError: action.message };
    case 'SUCCESS_GET_USER':
      return { ...state, dbData: action.data };
    case 'SUCCESS_SEND_NAME':
      return {
        ...state,
        dbData: {
          ...state.dbData,
          name: action.name
        }
      };
    case 'CREATE_TOKEN':
      return {
        ...state,
        isCreatingToken: true
      };
    case 'CREATE_TOKEN_SUCCESS':
      return {
        ...state,
        token: action.token,
        isCreatingToken: false
      };
    case 'CREATE_TOKEN_FAIL':
      return {
        ...state,
        isCreatingToken: false
      };
    case 'SUCCESS_GET_HISTORY':
      return {
        ...state,
        history: (state.history || []).concat(action.data),
        hasGetAllHistory: action.hasGetAll
      };
    case 'CONFIRM_PHONE_NUMBER':
      return {
        ...state,
        phoneNumberConfirmation: action.phoneNumberConfirmation
      };
    case 'SUCCESS_CONFIRM_PHONE_NUMBER':
      return {
        ...state,
        phoneNumberConfirmation: null,
        data: action.user
      };
    case 'SEND_HISTORY':
      const date = new Date().toDateString();
      const { token } = action;
      return {
        ...state,
        isSendingHistory: true,
        historyLog: {
          ...state.historyLog,
          [date]: {
            ...state.historyLog[date],
            [token]: true
          }
        }
      };
    case 'SEND_HISTORY_SUCCESS':
      return {
        ...state,
        isSendingHistory: false,
        sentHistory: action.data
      };
    case 'SEND_HISTORY_FAIL':
      return {
        ...state,
        isSendingHistory: false
      };
    case 'CONFIRM_HISTORY':
      return {
        ...state,
        sentHistory: null
      };
    case "CHANGE_DATE":
      return {
        ...state,
        historyLog: {}
      };
    default:
      return state;
  }
};

export const reducers = combineReducers({
  user: reducer
});

export const store = createStore(reducers, applyMiddleware(thunk));

auth.onAuthStateChanged((user) => {
  console.log('auth state changed', user);
  const current = store.getState().user.data;
  if (!current && user) {
    store.dispatch({
      type: 'SUCCESS_AUTH_USER',
      data: user
    });
    db.collection('/users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        store.dispatch({
          type: 'SUCCESS_GET_USER',
          data: documentSnapshot.data()
        });
      });
    refreshToken()(store.dispatch);
  } else if (current && !user) {
    store.dispatch({
      type: 'SIGN_OUT_USER'
    });
  }
});

addChangeDateListener(() => {
  console.log('date changed');
  store.dispatch({
    type: 'CHANGE_DATE'
  });
});
