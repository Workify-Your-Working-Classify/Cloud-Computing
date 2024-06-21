const { auth, db } = require('../firebase');

// Function to create a new user
async function createUser(email, password, displayName) {
  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      createdAt: new Date().toISOString(),
    });

    return userRecord;
  } catch (error) {
    throw new Error('Error creating new user: ' + error.message);
  }
}

// Function to get user by email
async function getUserByEmail(email) {
  try {
    const user = await auth.getUserByEmail(email);
    return user;
  } catch (error) {
    throw new Error('Error fetching user by email: ' + error.message);
  }
}

// Function to get user data from Firestore
async function getUserData(uid) {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    return userDoc.data();
  } catch (error) {
    throw new Error('Error fetching user data: ' + error.message);
  }
}


module.exports = {
  createUser,
  getUserByEmail,
  getUserData
};
