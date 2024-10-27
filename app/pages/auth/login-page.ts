import { EventData, Page } from '@nativescript/core';
import { LoginViewModel } from '../../viewmodels/login-view-model';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new LoginViewModel();
}