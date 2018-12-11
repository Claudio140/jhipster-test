import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITaskingParameter } from 'app/shared/model/tasking-parameter.model';

@Component({
    selector: 'jhi-tasking-parameter-detail',
    templateUrl: './tasking-parameter-detail.component.html'
})
export class TaskingParameterDetailComponent implements OnInit {
    taskingParameter: ITaskingParameter;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ taskingParameter }) => {
            this.taskingParameter = taskingParameter;
        });
    }

    previousState() {
        window.history.back();
    }
}
