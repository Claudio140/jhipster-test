import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITaskExecution } from 'app/shared/model/task-execution.model';

@Component({
    selector: 'jhi-task-execution-detail',
    templateUrl: './task-execution-detail.component.html'
})
export class TaskExecutionDetailComponent implements OnInit {
    taskExecution: ITaskExecution;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ taskExecution }) => {
            this.taskExecution = taskExecution;
        });
    }

    previousState() {
        window.history.back();
    }
}
