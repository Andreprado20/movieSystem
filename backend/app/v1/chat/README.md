# Chat System Authentication Guide

## Overview

The chat system supports two authentication methods:
1. Firebase Authentication (preferred)
2. Custom JWT Authentication (legacy)

## Firebase Authentication (Recommended)

### Client-Side Implementation

1. **Set up Firebase in your frontend application**:

```javascript
// Using Firebase v9
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your Firebase configuration 
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "moviesystem-c4130.firebaseapp.com",
  projectId: "moviesystem-c4130",
  storageBucket: "moviesystem-c4130.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

2. **Sign in a user using Firebase**:

```javascript
// Email/password sign in
async function signInWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

// Google sign in
async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}
```

3. **Get the Firebase ID token for API requests**:

```javascript
async function getFirebaseToken() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is signed in");
  }
  
  try {
    // This will return a fresh token
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    throw error;
  }
}
```

4. **Use the token for API requests and WebSocket connections**:

```javascript
// For API requests
async function createChatGroup(groupData) {
  const token = await getFirebaseToken();
  
  const response = await fetch('/api/v1/chat/groups', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(groupData)
  });
  
  return response.json();
}

// For WebSocket connections
function connectToWebSocket(groupId) {
  const token = await getFirebaseToken();
  const socket = new WebSocket(`ws://your-api-domain/api/v1/chat/ws/${groupId}?token=${token}`);
  
  socket.onopen = () => {
    console.log('WebSocket connected');
  };
  
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message:', message);
  };
  
  return socket;
}
```

5. **Verify or register your Firebase user with our backend**:

```javascript
async function verifyFirebaseUser() {
  const token = await getFirebaseToken();
  
  const response = await fetch('/api/v1/auth/firebase-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id_token: token })
  });
  
  return response.json();
}
```

## Troubleshooting

### Common errors:

1. **"Firebase ID token has no 'kid' claim"**:
   - This error occurs when you're trying to use a custom JWT instead of a Firebase token
   - Make sure you're using `user.getIdToken()` from Firebase auth, not a custom token

2. **"Invalid token format"**:
   - Ensure you're properly formatting the Authorization header: `Bearer <token>`

3. **Expired token**:
   - Firebase tokens expire after 1 hour by default
   - Always get a fresh token before making API requests

4. **Firebase project mismatch**:
   - Make sure the token comes from the same Firebase project configured on the backend 