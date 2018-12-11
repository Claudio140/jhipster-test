import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITaskingCapability } from 'app/shared/model/tasking-capability.model';

@Component({
    selector: 'jhi-tasking-capability-detail',
    templateUrl: './tasking-capability-detail.component.html'
})
export class TaskingCapabilityDetailComponent implements OnInit {
    taskingCapability: ITaskingCapability;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ taskingCapability }) => {
            this.taskingCapability = taskingCapability;
        });
    }

    previousState() {
        window.history.back();
    }
}
