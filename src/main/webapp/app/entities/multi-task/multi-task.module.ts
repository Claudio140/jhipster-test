import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PermaSharedModule } from 'app/shared';
import {
    MultiTaskComponent,
    MultiTaskDetailComponent,
    MultiTaskUpdateComponent,
    MultiTaskDeletePopupComponent,
    MultiTaskDeleteDialogComponent,
    multiTaskRoute,
    multiTaskPopupRoute
} from './';

const ENTITY_STATES = [...multiTaskRoute, ...multiTaskPopupRoute];

@NgModule({
    imports: [PermaSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        MultiTaskComponent,
        MultiTaskDetailComponent,
        MultiTaskUpdateComponent,
        MultiTaskDeleteDialogComponent,
        MultiTaskDeletePopupComponent
    ],
    entryComponents: [MultiTaskComponent, MultiTaskUpdateComponent, MultiTaskDeleteDialogComponent, MultiTaskDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PermaMultiTaskModule {}
