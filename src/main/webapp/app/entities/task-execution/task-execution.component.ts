import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITaskExecution } from 'app/shared/model/task-execution.model';
import { Principal } from 'app/core';
import { TaskExecutionService } from './task-execution.service';

@Component({
    selector: 'jhi-task-execution',
    templateUrl: './task-execution.component.html'
})
export class TaskExecutionComponent implements OnInit, OnDestroy {
    taskExecutions: ITaskExecution[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private taskExecutionService: TaskExecutionService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.taskExecutionService
                .search({
                    query: this.currentSearch
                })
                .subscribe(
                    (res: HttpResponse<ITaskExecution[]>) => (this.taskExecutions = res.body),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.taskExecutionService.query().subscribe(
            (res: HttpResponse<ITaskExecution[]>) => {
                this.taskExecutions = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInTaskExecutions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITaskExecution) {
        return item.id;
    }

    registerChangeInTaskExecutions() {
        this.eventSubscriber = this.eventManager.subscribe('taskExecutionListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
