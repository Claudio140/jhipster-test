import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ITaskingParameter } from 'app/shared/model/tasking-parameter.model';
import { TaskingParameterService } from './tasking-parameter.service';

@Component({
    selector: 'jhi-tasking-parameter-update',
    templateUrl: './tasking-parameter-update.component.html'
})
export class TaskingParameterUpdateComponent implements OnInit {
    taskingParameter: ITaskingParameter;
    isSaving: boolean;

    constructor(private taskingParameterService: TaskingParameterService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ taskingParameter }) => {
            this.taskingParameter = taskingParameter;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.taskingParameter.id !== undefined) {
            this.subscribeToSaveResponse(this.taskingParameterService.update(this.taskingParameter));
        } else {
            this.subscribeToSaveResponse(this.taskingParameterService.create(this.taskingParameter));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ITaskingParameter>>) {
        result.subscribe((res: HttpResponse<ITaskingParameter>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
