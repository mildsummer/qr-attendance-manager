import firebasemock from "firebase-mock";

const mockdatabase = new firebasemock.MockFirebase();
const mockauth = new firebasemock.MockFirebase();
const mocksdk = new firebasemock.MockFirebaseSdk(
  path => (path ? mockdatabase.child(path) : mockdatabase),
  () => mockauth
);

export const auth = mocksdk.auth();
export const db = mocksdk.firestore();
export default mocksdk;
