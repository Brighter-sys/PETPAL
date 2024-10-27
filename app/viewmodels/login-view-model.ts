import { Observable, Frame, alert } from '@nativescript/core';
import { AuthService } from '../services/auth.service';

export class LoginViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';
    private authService: AuthService;

    constructor() {
        super();
        this.authService = AuthService.getInstance();
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
        }
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
        }
    }

    async onGoogleSignIn() {
        try {
            const user = await this.authService.signInWithGoogle();
            if (user) {
                console.log('Successfully signed in with Google:', user.email);
                // Navigate to home page or appropriate screen
                Frame.topmost().navigate({
                    moduleName: 'pages/home/home-page',
                    clearHistory: true
                });
            }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            alert({
                title: 'Sign In Error',
                message: 'Failed to sign in with Google. Please try again.',
                okButtonText: 'OK'
            });
        }
    }

    onLogin() {
        // TODO: Implement email/password authentication
        console.log('Login attempt with:', this.email);
    }

    onBuyerRegister() {
        Frame.topmost().navigate({
            moduleName: 'pages/auth/buyer-register-page',
            clearHistory: false
        });
    }

    onSellerRegister() {
        Frame.topmost().navigate({
            moduleName: 'pages/auth/seller-register-page',
            clearHistory: false
        });
    }
}