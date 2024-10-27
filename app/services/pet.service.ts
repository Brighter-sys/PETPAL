import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { NotificationService } from './notification.service';

export class PetService {
    private static instance: PetService;
    private firestore: firebase.firestore.Firestore;
    private notificationService: NotificationService;

    private constructor() {
        this.firestore = firebase.firestore();
        this.notificationService = NotificationService.getInstance();
    }

    public static getInstance(): PetService {
        if (!PetService.instance) {
            PetService.instance = new PetService();
        }
        return PetService.instance;
    }

    async getRecommendedPets(filters?: any): Promise<any[]> {
        try {
            let query = this.firestore.collection('pets')
                .where('status', '==', 'available');

            if (filters) {
                if (filters.type && filters.type !== 'all') {
                    query = query.where('type', '==', filters.type);
                }
                if (filters.price) {
                    query = query.where('price', '>=', filters.price.min)
                              .where('price', '<=', filters.price.max);
                }
                if (filters.tags && filters.tags.length > 0) {
                    query = query.where('tags', 'array-contains-any', filters.tags);
                }
            }

            const snapshot = await query.limit(10).get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting pets:', error);
            return [];
        }
    }

    async likePet(petId: string): Promise<void> {
        try {
            const userId = firebase.auth().currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            await this.firestore.collection('likes').add({
                userId,
                petId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Send notification to seller
            await this.notificationService.sendInterestNotification(petId, userId);
        } catch (error) {
            console.error('Error liking pet:', error);
        }
    }

    // ... rest of the existing methods
}