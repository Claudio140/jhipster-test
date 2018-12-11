import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { ITaskExecution } from 'app/shared/model/task-execution.model';
import { TaskExecutionService } from './task-execution.service';
import { IMultiTask } from 'app/shared/model/multi-task.model';
import { MultiTaskService } from 'app/entities/multi-task';

@Component({
    selector: 'jhi-task-execution-update',
    templateUrl: './task-execution-update.component.html'
})
export class TaskExecutionUpdateComponent implements OnInit {
    taskExecution: ITaskExecution;
    isSaving: boolean;

    multitasks: IMultiTask[];
    timestamp: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private taskExecutionService: TaskExecutionService,
        private multiTaskService: MultiTaskService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ taskExecution }) => {
            this.taskExecution = taskExecution;
            this.timestamp = this.taskExecution.timestamp != null ? this.taskExecution.timestamp.format(DATE_TIME_FORMAT) : null;
        });
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
        this.taskExecution.timestamp = this.timestamp != null ? moment(this.timestamp, DATE_TIME_FORMAT) : null;
        if (this.taskExecution.id !== undefined) {
            this.subscribeToSaveResponse(this.taskExecutionService.update(this.taskExecution));
        } else {
            this.subscribeToSaveResponse(this.taskExecutionService.create(this.taskExecution));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ITaskExecution>>) {
        result.subscribe((res: HttpResponse<ITaskExecution>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackMultiTaskById(index: number, item: IMultiTask) {
        return item.id;
    }
}
