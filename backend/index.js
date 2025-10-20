// --- Part 1: Import necessary packages ---
// We need 'firebase-admin' to connect to our Firebase project.
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const express = require('express');


// --- Part 2: Connect to Firebase ---
// IMPORTANT: You need to get your service account key file.
// 1. Go to your Firebase Project Settings -> Service accounts tab.
// 2. Click "Generate new private key" to download the JSON file.
// 3. Save this file in your `backend` folder with the name `serviceAccountKey.json`.
// 4. Remember to add `serviceAccountKey.json` to your .gitignore file to keep it private.
const serviceAccount = require('./serviceAccountKey.json');

// This initializes your Firebase app with the admin credentials
initializeApp({
  credential: cert(serviceAccount)
});

// This gives you access to the Firestore database
const db = getFirestore();

console.log('Firebase Admin SDK is connected successfully!');


// --- Part 3: Create a simple server ---
// This will be the foundation for your API
const app = express();
const port = 3001; // You can use any port you like

// This is a test route to make sure your server is working
app.get('/', (req, res) => {
  res.send('Hello from the Code Sensei Backend!');
});

// This starts the server
app.listen(port, () => {
  console.log(`Backend server is listening at http://localhost:${port}`);
});

// --- Your API routes for code analysis will go here later ---

