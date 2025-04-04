import admin from 'firebase-admin';

console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Firebase Admin initialization error:', error.stack);
    } else {
      console.error('An unknown error occurred during Firebase Admin initialization.');
    }
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth, admin };
