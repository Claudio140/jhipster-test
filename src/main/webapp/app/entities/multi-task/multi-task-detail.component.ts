import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMultiTask } from 'app/shared/model/multi-task.model';

@Component({
    selector: 'jhi-multi-task-detail',
    templateUrl: './multi-task-detail.component.html'
})
export class MultiTaskDetailComponent implements OnInit {
    multiTask: IMultiTask;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ multiTask }) => {
            this.multiTask = multiTask;
        });
    }

    previousState() {
        window.history.back();
    }
}
