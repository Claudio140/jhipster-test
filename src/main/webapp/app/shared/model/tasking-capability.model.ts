import { IActor } from 'app/shared/model//actor.model';
import { IMultiTask } from 'app/shared/model//multi-task.model';

export interface ITaskingCapability {
    id?: number;
    name?: string;
    description?: string;
    taskingParameters?: string;
    properties?: string;
    actor?: IActor;
    multiTask?: IMultiTask;
}

export class TaskingCapability implements ITaskingCapability {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public taskingParameters?: string,
        public properties?: string,
        public actor?: IActor,
        public multiTask?: IMultiTask
    ) {}
}
