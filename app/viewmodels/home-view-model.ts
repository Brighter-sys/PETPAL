import { Observable, Frame } from '@nativescript/core';
import { PetService } from '../services/pet.service';

export class HomeViewModel extends Observable {
    private petService: PetService;
    private _visiblePets: Array<any> = [];
    private _matches: Array<any> = [];
    private _selectedTabIndex: number = 0;

    constructor() {
        super();
        this.petService = PetService.getInstance();
        this.loadPets();
        this.loadMatches();
    }

    get visiblePets(): Array<any> {
        return this._visiblePets;
    }

    get matches(): Array<any> {
        return this._matches;
    }

    get selectedTabIndex(): number {
        return this._selectedTabIndex;
    }

    set selectedTabIndex(value: number) {
        if (this._selectedTabIndex !== value) {
            this._selectedTabIndex = value;
            this.notifyPropertyChange('selectedTabIndex', value);
        }
    }

    async loadPets() {
        try {
            const pets = await this.petService.getRecommendedPets();
            this._visiblePets = pets;
            this.notifyPropertyChange('visiblePets', pets);
        } catch (error) {
            console.error('Error loading pets:', error);
        }
    }

    async loadMatches() {
        try {
            const matches = await this.petService.getMatches();
            this._matches = matches;
            this.notifyPropertyChange('matches', matches);
        } catch (error) {
            console.error('Error loading matches:', error);
        }
    }

    onSwipeLeft(args: any) {
        this.removePetCard(args.object.petData, false);
    }

    onSwipeRight(args: any) {
        this.removePetCard(args.object.petData, true);
    }

    private removePetCard(pet: any, liked: boolean) {
        const index = this._visiblePets.indexOf(pet);
        if (index > -1) {
            this._visiblePets.splice(index, 1);
            this.notifyPropertyChange('visiblePets', this._visiblePets);
            
            if (liked) {
                this.petService.likePet(pet.id);
            }
        }
    }

    onUndo() {
        // Implement undo functionality
    }

    onChatTap(args: any) {
        const matchData = args.object.bindingContext;
        Frame.topmost().navigate({
            moduleName: 'pages/chat/chat-page',
            context: { matchedPet: matchData }
        });
    }
}