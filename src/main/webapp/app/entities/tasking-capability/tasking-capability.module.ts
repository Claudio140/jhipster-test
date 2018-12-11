import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PermaSharedModule } from 'app/shared';
import {
    TaskingCapabilityComponent,
    TaskingCapabilityDetailComponent,
    TaskingCapabilityUpdateComponent,
    TaskingCapabilityDeletePopupComponent,
    TaskingCapabilityDeleteDialogComponent,
    taskingCapabilityRoute,
    taskingCapabilityPopupRoute
} from './';

const ENTITY_STATES = [...taskingCapabilityRoute, ...taskingCapabilityPopupRoute];

@NgModule({
    imports: [PermaSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        TaskingCapabilityComponent,
        TaskingCapabilityDetailComponent,
        TaskingCapabilityUpdateComponent,
        TaskingCapabilityDeleteDialogComponent,
        TaskingCapabilityDeletePopupComponent
    ],
    entryComponents: [
        TaskingCapabilityComponent,
        TaskingCapabilityUpdateComponent,
        TaskingCapabilityDeleteDialogComponent,
        TaskingCapabilityDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PermaTaskingCapabilityModule {}
