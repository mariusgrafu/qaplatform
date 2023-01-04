const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKeys.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://amss-30783-default-rtdb.firebaseio.com"
});

module.exports = firebaseAdmin;
