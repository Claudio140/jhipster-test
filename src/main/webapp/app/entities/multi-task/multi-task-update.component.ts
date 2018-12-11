import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IMultiTask } from 'app/shared/model/multi-task.model';
import { MultiTaskService } from './multi-task.service';

@Component({
    selector: 'jhi-multi-task-update',
    templateUrl: './multi-task-update.component.html'
})
export class MultiTaskUpdateComponent implements OnInit {
    multiTask: IMultiTask;
    isSaving: boolean;
    creationTime: string;

    constructor(private multiTaskService: MultiTaskService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ multiTask }) => {
            this.multiTask = multiTask;
            this.creationTime = this.multiTask.creationTime != null ? this.multiTask.creationTime.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.multiTask.creationTime = this.creationTime != null ? moment(this.creationTime, DATE_TIME_FORMAT) : null;
        if (this.multiTask.id !== undefined) {
            this.subscribeToSaveResponse(this.multiTaskService.update(this.multiTask));
        } else {
            this.subscribeToSaveResponse(this.multiTaskService.create(this.multiTask));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IMultiTask>>) {
        result.subscribe((res: HttpResponse<IMultiTask>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
