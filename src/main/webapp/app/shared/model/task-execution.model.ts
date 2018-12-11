import { Moment } from 'moment';
import { IMultiTask } from 'app/shared/model//multi-task.model';

export interface ITaskExecution {
    id?: number;
    timestamp?: Moment;
    multiTask?: IMultiTask;
}

export class TaskExecution implements ITaskExecution {
    constructor(public id?: number, public timestamp?: Moment, public multiTask?: IMultiTask) {}
}
