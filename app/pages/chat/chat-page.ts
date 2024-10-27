import { EventData, Page } from '@nativescript/core';
import { ChatViewModel } from '../../viewmodels/chat-view-model';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const matchedPet = page.navigationContext.matchedPet;
    page.bindingContext = new ChatViewModel(matchedPet);
}

export function onUnloaded(args: EventData) {
    const page = <Page>args.object;
    const viewModel = page.bindingContext as ChatViewModel;
    viewModel.onUnloaded();
}