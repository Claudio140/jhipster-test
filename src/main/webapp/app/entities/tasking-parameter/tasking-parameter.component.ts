import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITaskingParameter } from 'app/shared/model/tasking-parameter.model';
import { Principal } from 'app/core';
import { TaskingParameterService } from './tasking-parameter.service';

@Component({
    selector: 'jhi-tasking-parameter',
    templateUrl: './tasking-parameter.component.html'
})
export class TaskingParameterComponent implements OnInit, OnDestroy {
    taskingParameters: ITaskingParameter[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private taskingParameterService: TaskingParameterService,
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
            this.taskingParameterService
                .search({
                    query: this.currentSearch
                })
                .subscribe(
                    (res: HttpResponse<ITaskingParameter[]>) => (this.taskingParameters = res.body),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.taskingParameterService.query().subscribe(
            (res: HttpResponse<ITaskingParameter[]>) => {
                this.taskingParameters = res.body;
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
        this.registerChangeInTaskingParameters();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITaskingParameter) {
        return item.id;
    }

    registerChangeInTaskingParameters() {
        this.eventSubscriber = this.eventManager.subscribe('taskingParameterListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
