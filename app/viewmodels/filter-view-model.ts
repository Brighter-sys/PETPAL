import { Observable } from '@nativescript/core';

export class FilterViewModel extends Observable {
    private _selectedType: string = 'all';
    private _minAge: number = 0;
    private _maxAge: number = 20;
    private _minPrice: number = 0;
    private _maxPrice: number = 10000;
    private _distance: number = 50;
    private _selectedTags: string[] = [];

    constructor() {
        super();
    }

    onTypeSelect(args: any) {
        const button = args.object;
        this.selectedType = button.text.toLowerCase();
    }

    onTagSelect(args: any) {
        const button = args.object;
        const tag = button.text.toLowerCase();
        
        if (this._selectedTags.includes(tag)) {
            this._selectedTags = this._selectedTags.filter(t => t !== tag);
        } else {
            this._selectedTags.push(tag);
        }
        
        this.notifyPropertyChange('selectedTags', this._selectedTags);
    }

    applyFilters() {
        const filters = {
            type: this.selectedType,
            age: { min: this.minAge, max: this.maxAge },
            price: { min: this.minPrice, max: this.maxPrice },
            distance: this.distance,
            tags: this.selectedTags
        };
        
        this.closeCallback(filters);
    }

    resetFilters() {
        this.selectedType = 'all';
        this.minAge = 0;
        this.maxAge = 20;
        this.minPrice = 0;
        this.maxPrice = 10000;
        this.distance = 50;
        this._selectedTags = [];
        this.notifyPropertyChange('selectedTags', this._selectedTags);
    }

    // Getters and setters for all properties
    get selectedType(): string {
        return this._selectedType;
    }

    set selectedType(value: string) {
        if (this._selectedType !== value) {
            this._selectedType = value;
            this.notifyPropertyChange('selectedType', value);
        }
    }

    // ... Similar getters and setters for other properties
}