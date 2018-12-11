export interface ITaskingParameter {
    id?: number;
    name?: string;
}

export class TaskingParameter implements ITaskingParameter {
    constructor(public id?: number, public name?: string) {}
}
