import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IActor } from 'app/shared/model/actor.model';
import { ActorService } from './actor.service';
import { ILocation } from 'app/shared/model/location.model';
import { LocationService } from 'app/entities/location';

@Component({
    selector: 'jhi-actor-update',
    templateUrl: './actor-update.component.html'
})
export class ActorUpdateComponent implements OnInit {
    actor: IActor;
    isSaving: boolean;

    locations: ILocation[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private actorService: ActorService,
        private locationService: LocationService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ actor }) => {
            this.actor = actor;
        });
        this.locationService.query().subscribe(
            (res: HttpResponse<ILocation[]>) => {
                this.locations = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.actor.id !== undefined) {
            this.subscribeToSaveResponse(this.actorService.update(this.actor));
        } else {
            this.subscribeToSaveResponse(this.actorService.create(this.actor));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IActor>>) {
        result.subscribe((res: HttpResponse<IActor>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackLocationById(index: number, item: ILocation) {
        return item.id;
    }
}
