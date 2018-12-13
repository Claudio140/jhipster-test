import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PermaActorModule } from './actor/actor.module';
import { PermaTaskingCapabilityModule } from './tasking-capability/tasking-capability.module';
import { PermaTaskingParameterModule } from './tasking-parameter/tasking-parameter.module';
import { PermaLocationModule } from './location/location.module';
import { PermaMultiTaskModule } from './multi-task/multi-task.module';
import { PermaTaskExecutionModule } from './task-execution/task-execution.module';
import { PermaTaskModule } from './task/task.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        PermaActorModule,
        PermaTaskingCapabilityModule,
        PermaTaskingParameterModule,
        PermaLocationModule,
        PermaMultiTaskModule,
        PermaTaskExecutionModule,
        PermaTaskModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PermaEntityModule {}
