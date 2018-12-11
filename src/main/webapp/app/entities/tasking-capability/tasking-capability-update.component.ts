import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { ITaskingCapability } from 'app/shared/model/tasking-capability.model';
import { TaskingCapabilityService } from './tasking-capability.service';
import { IActor } from 'app/shared/model/actor.model';
import { ActorService } from 'app/entities/actor';
import { IMultiTask } from 'app/shared/model/multi-task.model';
import { MultiTaskService } from 'app/entities/multi-task';

@Component({
    selector: 'jhi-tasking-capability-update',
    templateUrl: './tasking-capability-update.component.html'
})
export class TaskingCapabilityUpdateComponent implements OnInit {
    taskingCapability: ITaskingCapability;
    isSaving: boolean;

    actors: IActor[];

    multitasks: IMultiTask[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private taskingCapabilityService: TaskingCapabilityService,
        private actorService: ActorService,
        private multiTaskService: MultiTaskService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ taskingCapability }) => {
            this.taskingCapability = taskingCapability;
        });
        this.actorService.query().subscribe(
            (res: HttpResponse<IActor[]>) => {
                this.actors = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.multiTaskService.query().subscribe(
            (res: HttpResponse<IMultiTask[]>) => {
                this.multitasks = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.taskingCapability.id !== undefined) {
            this.subscribeToSaveResponse(this.taskingCapabilityService.update(this.taskingCapability));
        } else {
            this.subscribeToSaveResponse(this.taskingCapabilityService.create(this.taskingCapability));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ITaskingCapability>>) {
        result.subscribe((res: HttpResponse<ITaskingCapability>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackActorById(index: number, item: IActor) {
        return item.id;
    }

    trackMultiTaskById(index: number, item: IMultiTask) {
        return item.id;
    }
}
