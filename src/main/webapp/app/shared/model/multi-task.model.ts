import { Moment } from 'moment';
import { ITaskingCapability } from 'app/shared/model//tasking-capability.model';
import { ITaskExecution } from 'app/shared/model//task-execution.model';

export interface IMultiTask {
    id?: number;
    creationTime?: Moment;
    taskingParameter?: string;
    taskingCapabilities?: ITaskingCapability[];
    taskExecutions?: ITaskExecution[];
}

export class MultiTask implements IMultiTask {
    constructor(
        public id?: number,
        public creationTime?: Moment,
        public taskingParameter?: string,
        public taskingCapabilities?: ITaskingCapability[],
        public taskExecutions?: ITaskExecution[]
    ) {}
}
