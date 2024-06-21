const { auth, db } = require('../firebase');
const jwt = require('jsonwebtoken');
const { runPythonScript } = require('./modelController'); // Import processRequest untuk menggunakan prediksi model

// Fungsi untuk mendaftarkan pengguna baru
async function registerUser(req, res) {
  const { email, password, displayName } = req.body;

  try {
    const userRecord = await auth.createUser({ email, password, displayName });
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      displayName: displayName,
      password: password,
      createdAt: new Date().toISOString(),
    });

    res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).send({ error: 'Error creating new user' });
  }
}

// Fungsi untuk login pengguna
async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await auth.getUserByEmail(email);
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists || userDoc.data().password !== password) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ message: 'User logged in successfully', uid: user, token: token });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).send({ error: 'Error logging in user', message: error.message });
  }
}

// Fungsi untuk mendapatkan data pengguna
async function getUser(req, res) {
  const userId = req.params.id;

  try {
    const userDoc = await auth.getUser(userId);
    res.status(200).send(userDoc);
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).send({ error: 'Error getting user data' });
  }
}

// Fungsi untuk logout pengguna
async function logoutUser(req, res) {
  try {
    res.status(200).send({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).send({ error: 'Error logging out user' });
  }
}

async function generateToken(req, res) {
  const { uid } = req.body;

  try {
    const token = jwt.sign({ uid: uid }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).send({ error: 'Error generating token' });
  }
}

// Fungsi untuk menambahkan kegiatan
async function addKegiatan(req, res) {
  const userId = req.params.uid;
  console.log('Received userId:', userId); // Log untuk debugging
  const { jenisKegiatan, namaKegiatan, kepentinganKegiatan, pelaksana, tanggal, jam, lama, Deskripsi, kepentinganPelaksana } = req.body;
  console.log('Received body:', req.body); // Log untuk debugging

  try {
    const kepentinganKegiatanNum = Number(kepentinganKegiatan);
    const kepentinganPelaksanaNum = Number(kepentinganPelaksana);
    const lamaNum = Number(lama);

    const kegiatanDate = new Date(tanggal + ' ' + jam);
    const currentTime = new Date();
    const timeDifference = kegiatanDate - currentTime;
    let urgencyStatus;

    if (timeDifference < 24 * 60 * 60 * 1000) {
      urgencyStatus = 2; // Urgent
    } else {
      urgencyStatus = 0; // Not Urgent
    }

    // Dapatkan hasil prediksi dari model
    console.log('Deskripsi:', Deskripsi); // Log untuk debugging

    const prediksi = await runPythonScript([Deskripsi])

    console.log('Prediction result:', prediksi); // Log untuk debugging

    const prediksiModel = prediksi.predictions[0].predicted_label;

    // Hitung status kegiatan value
    const statusKegiatanSum = urgencyStatus + prediksiModel;
    let statusKegiatanValue;

    switch (statusKegiatanSum) {
      case 0:
        statusKegiatanValue = 0.25;
        break;
      case 1:
        statusKegiatanValue = 0.5;
        break;
      case 2:
        statusKegiatanValue = 0.75;
        break;
      case 3:
        statusKegiatanValue = 1;
        break;
      default:
        throw new Error('Invalid status sum');
    }

    const totalPoint = ((kepentinganPelaksanaNum + kepentinganKegiatanNum) * (1 + (0.2 * lamaNum)) * statusKegiatanValue);

    const newKegiatan = {
      jenisKegiatan,
      namaKegiatan,
      kepentinganKegiatan: kepentinganKegiatanNum,
      pelaksana,
      tanggal,
      jam,
      lama: lamaNum,
      Deskripsi,
      kepentinganPelaksana: kepentinganPelaksanaNum,
      statusKegiatan: statusKegiatanValue,
      hasilprediksi : prediksiModel,
      totalPoint: totalPoint,
      dateCreated: new Date().toISOString()
    };

    const kegiatanRef = await db.collection('users').doc(userId).collection('Kegiatan').add(newKegiatan);
    res.status(200).send({ id: kegiatanRef.id, ...newKegiatan });

  } catch (error) {
    console.error('Error adding kegiatan:', error);
    if (!res.headersSent) {
      res.status(500).send({ error: 'Error adding kegiatan', details: error.message });
    }
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  generateToken,
  addKegiatan
};
