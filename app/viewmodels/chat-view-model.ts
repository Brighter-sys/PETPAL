import { Observable } from '@nativescript/core';
import { ChatService, ChatMessage } from '../services/chat.service';

export class ChatViewModel extends Observable {
    private chatService: ChatService;
    private chatId: string;
    private unsubscribe: (() => void) | null = null;

    private _messages: Array<ChatMessage> = [];
    private _messageText: string = '';
    private _matchedPet: any;

    constructor(matchedPet: any) {
        super();
        this.chatService = ChatService.getInstance();
        this._matchedPet = matchedPet;
        
        const userId = firebase.auth().currentUser?.uid;
        this.chatId = this.chatService.getChatId(
            userId!,
            matchedPet.seller.id,
            matchedPet.id
        );
        
        this.subscribeToMessages();
    }

    get messages(): Array<ChatMessage> {
        return this._messages;
    }

    get messageText(): string {
        return this._messageText;
    }

    set messageText(value: string) {
        if (this._messageText !== value) {
            this._messageText = value;
            this.notifyPropertyChange('messageText', value);
        }
    }

    get matchedPet(): any {
        return this._matchedPet;
    }

    private subscribeToMessages() {
        this.unsubscribe = this.chatService.subscribeToMessages(
            this.chatId,
            (messages) => {
                this._messages = messages;
                this.notifyPropertyChange('messages', messages);
            }
        );
    }

    async onSendMessage() {
        if (!this.messageText.trim()) return;

        try {
            await this.chatService.sendMessage(this.chatId, this.messageText.trim());
            this.messageText = '';
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    onUnloaded() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
}