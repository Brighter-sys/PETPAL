import { Observable, Frame } from '@nativescript/core';
import { AuthService } from '../services/auth.service';

export class ProfileViewModel extends Observable {
    private authService: AuthService;
    private _name: string = '';
    private _email: string = '';
    private _phone: string = '';
    private _profileImage: string = '';
    private _petTypes: Array<string> = ['All Pets', 'Dogs', 'Cats', 'Birds', 'Others'];
    private _distances: Array<string> = ['5km', '10km', '25km', '50km'];
    private _selectedPetType: number = 0;
    private _selectedDistance: number = 0;

    constructor() {
        super();
        this.authService = AuthService.getInstance();
        this.loadUserProfile();
    }

    async loadUserProfile() {
        const user = firebase.auth().currentUser;
        if (user) {
            this.email = user.email || '';
            this.name = user.displayName || '';
            this.profileImage = user.photoURL || '';
            // Load additional user data from Firestore
        }
    }

    async onSave() {
        try {
            // Save profile changes to Firestore
            await this.saveUserProfile();
            // Show success message
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    }

    async onSignOut() {
        try {
            await this.authService.signOut();
            Frame.topmost().navigate({
                moduleName: 'pages/auth/login-page',
                clearHistory: true
            });
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    // Getters and setters for all properties
    get name(): string {
        return this._name;
    }

    set name(value: string) {
        if (this._name !== value) {
            this._name = value;
            this.notifyPropertyChange('name', value);
        }
    }

    // ... Similar getters and setters for other properties
}