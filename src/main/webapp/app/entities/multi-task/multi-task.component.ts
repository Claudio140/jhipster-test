import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMultiTask } from 'app/shared/model/multi-task.model';
import { Principal } from 'app/core';
import { MultiTaskService } from './multi-task.service';

@Component({
    selector: 'jhi-multi-task',
    templateUrl: './multi-task.component.html'
})
export class MultiTaskComponent implements OnInit, OnDestroy {
    multiTasks: IMultiTask[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private multiTaskService: MultiTaskService,
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
            this.multiTaskService
                .search({
                    query: this.currentSearch
                })
                .subscribe(
                    (res: HttpResponse<IMultiTask[]>) => (this.multiTasks = res.body),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.multiTaskService.query().subscribe(
            (res: HttpResponse<IMultiTask[]>) => {
                this.multiTasks = res.body;
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
        this.registerChangeInMultiTasks();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IMultiTask) {
        return item.id;
    }

    registerChangeInMultiTasks() {
        this.eventSubscriber = this.eventManager.subscribe('multiTaskListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
