import { ILocation } from 'app/shared/model//location.model';
import { ITaskingCapability } from 'app/shared/model//tasking-capability.model';

export interface IActor {
    id?: number;
    name?: string;
    description?: string;
    location?: ILocation;
    taskingCapabilities?: ITaskingCapability[];
}

export class Actor implements IActor {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public location?: ILocation,
        public taskingCapabilities?: ITaskingCapability[]
    ) {}
}
