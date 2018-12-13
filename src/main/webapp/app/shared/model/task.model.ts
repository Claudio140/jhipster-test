import { Moment } from 'moment';

export interface ITask {
    id?: number;
    name?: string;
    repetitions?: number;
    creationTime?: Moment;
    executionTime?: Moment;
}

export class Task implements ITask {
    constructor(
        public id?: number,
        public name?: string,
        public repetitions?: number,
        public creationTime?: Moment,
        public executionTime?: Moment
    ) {}
}
