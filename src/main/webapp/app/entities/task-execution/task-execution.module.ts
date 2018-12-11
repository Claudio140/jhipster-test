import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PermaSharedModule } from 'app/shared';
import {
    TaskExecutionComponent,
    TaskExecutionDetailComponent,
    TaskExecutionUpdateComponent,
    TaskExecutionDeletePopupComponent,
    TaskExecutionDeleteDialogComponent,
    taskExecutionRoute,
    taskExecutionPopupRoute
} from './';

const ENTITY_STATES = [...taskExecutionRoute, ...taskExecutionPopupRoute];

@NgModule({
    imports: [PermaSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        TaskExecutionComponent,
        TaskExecutionDetailComponent,
        TaskExecutionUpdateComponent,
        TaskExecutionDeleteDialogComponent,
        TaskExecutionDeletePopupComponent
    ],
    entryComponents: [
        TaskExecutionComponent,
        TaskExecutionUpdateComponent,
        TaskExecutionDeleteDialogComponent,
        TaskExecutionDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PermaTaskExecutionModule {}
