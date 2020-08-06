export const credentials = {
    apiKey: "AIzaSyBRaeBRVNJAe-ezvNSPq_qeuYcTc2FsYQw",
    authDomain: "autoeditorprogram-v1.firebaseapp.com",
    databaseURL: "https://autoeditorprogram-v1.firebaseio.com",
    projectId: "autoeditorprogram-v1",
    storageBucket: "autoeditorprogram-v1.appspot.com",
    messagingSenderId: "277510170775",
    appId: "1:277510170775:web:535da1324692bc610d21d2",
    measurementId: "G-GPB8N17HTW"
}

import * as admin from "firebase-admin";

const serviceAccount = require('./autoeditorprogram-v1-firebase-adminsdk-jdavn-e6c9624e3a.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: credentials.storageBucket
});

export var storage = {
    bucket: admin.storage().bucket()
}