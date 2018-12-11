import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PermaSharedModule } from 'app/shared';
import {
    TaskingParameterComponent,
    TaskingParameterDetailComponent,
    TaskingParameterUpdateComponent,
    TaskingParameterDeletePopupComponent,
    TaskingParameterDeleteDialogComponent,
    taskingParameterRoute,
    taskingParameterPopupRoute
} from './';

const ENTITY_STATES = [...taskingParameterRoute, ...taskingParameterPopupRoute];

@NgModule({
    imports: [PermaSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        TaskingParameterComponent,
        TaskingParameterDetailComponent,
        TaskingParameterUpdateComponent,
        TaskingParameterDeleteDialogComponent,
        TaskingParameterDeletePopupComponent
    ],
    entryComponents: [
        TaskingParameterComponent,
        TaskingParameterUpdateComponent,
        TaskingParameterDeleteDialogComponent,
        TaskingParameterDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PermaTaskingParameterModule {}
