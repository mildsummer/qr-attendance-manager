const constants = require('./constants/common.js');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { sendNotification } = require('./ExpoNotification');

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

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
        if (hostUser.uid === context.auth.uid) {
          throw new functions.https.HttpsError('unavailable', '自分自身のQRコードは無効です');
        } else {
          return db.collection('/users')
            .doc(context.auth.uid)
            .collection('/history')
            .where('date', '==', dateString)
            .where('uid', '==', hostUser.uid)
            .where('type', '==', constants.HISTORY_TYPE_GUEST)
            .get()
            .then((querySnapshot) => {
              if (querySnapshot.docs.length) {
                throw new functions.https.HttpsError('already-exists', 'すでに読み取りが完了しています');
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
        }
      } else {
        throw new functions.https.HttpsError('cancelled', '無効なQRコードです');
      }
    }).catch(() => {
      throw new functions.https.HttpsError('internal', 'エラーが発生しました');
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

exports.submitComment = functions.https.onCall(({ historyId, comment }, context) => {
  const user = db.collection('/users')
    .doc(context.auth.uid);
  const historyRef = user.collection('/history')
    .doc(historyId);
  let targetUser = null;
  let historyData = null;
  let key = null;
  let targetHistoryId = null;
  return historyRef
    .get()
    .then((historyDoc) => {
      historyData = historyDoc.data();
      targetUser = db.collection('/users').doc(historyData.uid);
      key = historyData.type === constants.HISTORY_TYPE_GUEST ? 'guestComment' : 'hostComment';
      if (historyData[key] !== comment) {
        return targetUser.collection('/history')
          .where('createdAt', '==', historyData.createdAt)
          .where('uid', '==', context.auth.uid)
          .get();
      } else {
        return { message: 'success' };
      }
    })
    .then((result) => {
      targetHistoryId = result.docs[0].id;
      const targetHistoryRef = targetUser.collection('/history').doc(targetHistoryId);
      const batch = db.batch();
      batch.update(historyRef, { [key]: comment });
      batch.update(targetHistoryRef, { [key]: comment });
      return batch.commit();
    })
    // .then(() => {
    //   if (comment) {
    //     targetUser.get().then((targetUserDoc) => {
    //       if (targetUserDoc.data().pushTokens) {
    //         const name = historyData.type === constants.HISTORY_TYPE_GUEST ? historyData.guestName : historyData.hostName;
    //         targetUserDoc.data().pushTokens.forEach((pushToken) => {
    //           sendNotification(
    //             pushToken,
    //             {
    //               title: historyData[key] ? 'コメントが更新されました' : 'コメントが届きました',
    //               subtitle: name,
    //               body: comment
    //             },
    //             { comment, historyId: targetHistoryId, name }
    //           );
    //         });
    //       }
    //     });
    //   }
    // })
    .then(() => ({ message: 'success' }))
    .catch(({ message }) => {
      throw new functions.https.HttpsError(message);
    });
});
