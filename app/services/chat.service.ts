import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { Observable } from '@nativescript/core';

export interface ChatMessage {
    id: string;
    text: string;
    senderId: string;
    timestamp: Date;
    isCurrentUser: boolean;
}

export class ChatService {
    private static instance: ChatService;
    private firestore: firebase.firestore.Firestore;

    private constructor() {
        this.firestore = firebase.firestore();
    }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    getChatId(userId: string, sellerId: string, petId: string): string {
        return `${userId}_${sellerId}_${petId}`;
    }

    async sendMessage(chatId: string, text: string): Promise<void> {
        const userId = firebase.auth().currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        await this.firestore.collection('chats').doc(chatId).collection('messages').add({
            text,
            senderId: userId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    subscribeToMessages(chatId: string, callback: (messages: ChatMessage[]) => void): () => void {
        const userId = firebase.auth().currentUser?.uid;
        
        const unsubscribe = this.firestore
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => {
                const messages = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        text: data.text,
                        senderId: data.senderId,
                        timestamp: data.timestamp?.toDate(),
                        isCurrentUser: data.senderId === userId
                    };
                });
                callback(messages);
            });

        return unsubscribe;
    }
}