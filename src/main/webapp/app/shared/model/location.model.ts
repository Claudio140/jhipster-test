import { IActor } from 'app/shared/model//actor.model';

export interface ILocation {
    id?: number;
    name?: string;
    latitude?: number;
    longitude?: number;
    actor?: IActor;
}

export class Location implements ILocation {
    constructor(public id?: number, public name?: string, public latitude?: number, public longitude?: number, public actor?: IActor) {}
}
