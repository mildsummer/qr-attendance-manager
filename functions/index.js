const constants = require('./constants/common.js');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

function generateToken() {
  const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
  const b = [];
  for (let i = 0; i < 28; i++) {
    const j = (Math.random() * (a.length-1)).toFixed(0);
    b[i] = a[j];
  }
  return b.join("");
}

exports.createUser = functions.auth.user().onCreate((user) => {
  return db.collection('/users')
    .doc(user.uid)
    .set({
      email: user.email,
      uid: user.uid
    });
});

exports.createHistory = functions.https.onCall((data, context) => {
  const { token, guestName } = data;
  const date = new Date();
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const timeStamp = admin.firestore.Timestamp.fromDate(date);
  return db.collection('/users')
    .where('token', '==', token)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.docs.length) {
        const hostUser = querySnapshot.docs[0].data();
        return db.collection('/users')
          .doc(context.auth.uid)
          .collection('/history')
          .where('date', '==', dateString)
          .where('uid', '==', hostUser.uid)
          .where('type', '==', constants.HISTORY_TYPE_GUEST)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.docs.length) {
              throw new functions.https.HttpsError('already-exists', 'The history already exists.');
            } else {
              return db.collection('/users')
                .doc(context.auth.uid)
                .collection('/history')
                .doc()
                .set({
                  createdAt: timeStamp,
                  date: dateString,
                  uid: hostUser.uid,
                  email: hostUser.email,
                  hostName: hostUser.name,
                  guestName,
                  type: constants.HISTORY_TYPE_GUEST
                })
                .then(() => {
                  return db.collection('/users')
                    .doc(hostUser.uid)
                    .collection('/history')
                    .doc()
                    .set({
                      createdAt: timeStamp,
                      date: dateString,
                      uid: context.auth.uid,
                      email: context.auth.token.email,
                      hostName: hostUser.name,
                      guestName,
                      type: constants.HISTORY_TYPE_HOST
                    })
                    .then(() => ({
                      email: hostUser.email,
                      hostName: hostUser.name,
                      token
                    }));
                });
            }
          });
      } else {
        throw new functions.https.HttpsError('cancelled', 'The qr code is invalid');
      }
    });
});

exports.createToken = functions.https.onCall((data, context) => {
  const token = generateToken();
  return db.collection('/users')
    .doc(context.auth.uid)
    .set({ token }, { merge: true })
    .then(() => (token));
});

exports.verifyEmail = functions.https.onCall((data) => {
  return auth.getUserByEmail(data.email).then((user) => {
    return db.collection('/users')
      .doc(user.uid)
      .update({ emailVerifiedAt: admin.firestore.Timestamp.fromDate(new Date()) })
      .then(() => {
        return { message: 'success' };
      }).catch(({ message }) => {
        throw new functions.https.HttpsError(message);
      });
  });
});
