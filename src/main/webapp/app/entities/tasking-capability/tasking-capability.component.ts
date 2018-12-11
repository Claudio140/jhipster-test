import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITaskingCapability } from 'app/shared/model/tasking-capability.model';
import { Principal } from 'app/core';
import { TaskingCapabilityService } from './tasking-capability.service';

@Component({
    selector: 'jhi-tasking-capability',
    templateUrl: './tasking-capability.component.html'
})
export class TaskingCapabilityComponent implements OnInit, OnDestroy {
    taskingCapabilities: ITaskingCapability[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private taskingCapabilityService: TaskingCapabilityService,
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
            this.taskingCapabilityService
                .search({
                    query: this.currentSearch
                })
                .subscribe(
                    (res: HttpResponse<ITaskingCapability[]>) => (this.taskingCapabilities = res.body),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.taskingCapabilityService.query().subscribe(
            (res: HttpResponse<ITaskingCapability[]>) => {
                this.taskingCapabilities = res.body;
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
        this.registerChangeInTaskingCapabilities();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITaskingCapability) {
        return item.id;
    }

    registerChangeInTaskingCapabilities() {
        this.eventSubscriber = this.eventManager.subscribe('taskingCapabilityListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
