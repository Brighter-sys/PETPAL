import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';
import { GoogleSignIn } from '@nativescript/google-signin';

export class AuthService {
    private static instance: AuthService;
    private auth: firebase.Auth;

    private constructor() {
        this.auth = firebase.auth();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async signInWithGoogle(): Promise<firebase.User | null> {
        try {
            const user = await GoogleSignIn.signIn();
            if (user) {
                const credential = firebase.auth.GoogleAuthProvider.credential(
                    user.idToken
                );
                const userCredential = await this.auth.signInWithCredential(credential);
                return userCredential.user;
            }
            return null;
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            throw error;
        }
    }

    async signOut(): Promise<void> {
        try {
            await this.auth.signOut();
            await GoogleSignIn.signOut();
        } catch (error) {
            console.error('Sign Out Error:', error);
            throw error;
        }
    }
}