import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';

export class NotificationService {
    private static instance: NotificationService;
    private firestore: firebase.firestore.Firestore;

    private constructor() {
        this.firestore = firebase.firestore();
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    async sendInterestNotification(petId: string, buyerId: string): Promise<void> {
        try {
            const petDoc = await this.firestore.collection('pets').doc(petId).get();
            const petData = petDoc.data();
            const sellerId = petData?.sellerId;

            if (!sellerId) return;

            // Create notification
            await this.firestore.collection('notifications').add({
                type: 'interest',
                petId,
                buyerId,
                sellerId,
                petName: petData?.name,
                status: 'unread',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Send automatic message
            const chatId = `${buyerId}_${sellerId}_${petId}`;
            await this.firestore.collection('chats').doc(chatId).collection('messages').add({
                text: `Hi! I'm interested in ${petData?.name}!`,
                senderId: buyerId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Update interested count
            await this.firestore.collection('pets').doc(petId).update({
                interestedCount: firebase.firestore.FieldValue.increment(1)
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }

    subscribeToNotifications(userId: string, callback: (notifications: any[]) => void): () => void {
        return this.firestore
            .collection('notifications')
            .where('sellerId', '==', userId)
            .where('status', '==', 'unread')
            .onSnapshot((snapshot) => {
                const notifications = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(notifications);
            });
    }
}