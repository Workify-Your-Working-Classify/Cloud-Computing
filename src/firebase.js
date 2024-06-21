const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('../firebase/workify-426005-firebase-adminsdk-zno5h-4cd5ee305f.json');

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://workify-426005.firebaseio.com'
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
