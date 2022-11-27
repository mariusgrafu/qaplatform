require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const {initializeApp} = require('@firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('@firebase/auth');

const firebaseAdmin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKeys.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://amss-30783-default-rtdb.firebaseio.com"
});

app.use(cors());
app.use(express.json());

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = firebaseAdmin.firestore();

app.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // ... user.uid
              // save data into real time database
              
                firestore.collection('users').doc(user.uid).set({
                    email: user.email,
                }).then(() => {
                    res.sendStatus(200);
                }).catch( (err) => {
                    console.warn(err);
                    res.sendStatus(500);
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                console.warn(errorMessage);
                res.sendStatus(500);
            });
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...

        // save log in details into real time database
        var lgDate = new Date();

        firestore.collection('users').doc(user.uid).set({
            email: user.email,
            last_login: lgDate,
        }).then(() => {
            res.sendStatus(200);
        }).catch( (err) => {
            console.warn(err);
            res.sendStatus(500);
        });
    })
    .catch((error) => {
        const errorMessage = error.message;
        console.warn(errorMessage);
        res.sendStatus(500);
    });
});

app.listen(3001, () => {
    console.log("Started listening on 3001");
});
