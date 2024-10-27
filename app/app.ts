import { Application } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';
import { GoogleSignIn } from '@nativescript/google-signin';

// Initialize Firebase
firebase.initializeApp();

// Initialize Google Sign-In
GoogleSignIn.init();

Application.run({ moduleName: 'app-root' });