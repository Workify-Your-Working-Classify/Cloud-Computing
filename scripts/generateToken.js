const admin = require('firebase-admin');

// Path ke file JSON service account key
const serviceAccount = require('./firebase/workify-426005-firebase-adminsdk-zno5h-4cd5ee305f.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://workify-426005.firebaseio.com'
});

async function generateToken(uid) {
  try {
    const token = await admin.auth().createCustomToken(uid);
    console.log('Generated Token:', token);
  } catch (error) {
    console.error('Error generating token:', error);
  }
}

// Ganti dengan UID pengguna Anda
generateToken('UID_PENGGUNA_ANDA');
