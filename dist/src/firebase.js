"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = exports.storage = exports.credentials = void 0;
exports.credentials = {
    apiKey: "AIzaSyBRaeBRVNJAe-ezvNSPq_qeuYcTc2FsYQw",
    authDomain: "autoeditorprogram-v1.firebaseapp.com",
    databaseURL: "https://autoeditorprogram-v1.firebaseio.com",
    projectId: "autoeditorprogram-v1",
    storageBucket: "autoeditorprogram-v1.appspot.com",
    messagingSenderId: "277510170775",
    appId: "1:277510170775:web:535da1324692bc610d21d2",
    measurementId: "G-GPB8N17HTW"
};
const admin = __importStar(require("firebase-admin"));
const serviceAccount = require('./autoeditorprogram-v1-firebase-adminsdk-jdavn-e6c9624e3a.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: exports.credentials.storageBucket
});
exports.storage = {
    bucket: admin.storage().bucket()
};
exports.firestore = admin.firestore();
