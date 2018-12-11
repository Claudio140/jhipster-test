import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MultiTask } from 'app/shared/model/multi-task.model';
import { MultiTaskService } from './multi-task.service';
import { MultiTaskComponent } from './multi-task.component';
import { MultiTaskDetailComponent } from './multi-task-detail.component';
import { MultiTaskUpdateComponent } from './multi-task-update.component';
import { MultiTaskDeletePopupComponent } from './multi-task-delete-dialog.component';
import { IMultiTask } from 'app/shared/model/multi-task.model';

@Injectable({ providedIn: 'root' })
export class MultiTaskResolve implements Resolve<IMultiTask> {
    constructor(private service: MultiTaskService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MultiTask> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<MultiTask>) => response.ok),
                map((multiTask: HttpResponse<MultiTask>) => multiTask.body)
            );
        }
        return of(new MultiTask());
    }
}

export const multiTaskRoute: Routes = [
    {
        path: 'multi-task',
        component: MultiTaskComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.multiTask.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'multi-task/:id/view',
        component: MultiTaskDetailComponent,
        resolve: {
            multiTask: MultiTaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.multiTask.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'multi-task/new',
        component: MultiTaskUpdateComponent,
        resolve: {
            multiTask: MultiTaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.multiTask.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'multi-task/:id/edit',
        component: MultiTaskUpdateComponent,
        resolve: {
            multiTask: MultiTaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.multiTask.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const multiTaskPopupRoute: Routes = [
    {
        path: 'multi-task/:id/delete',
        component: MultiTaskDeletePopupComponent,
        resolve: {
            multiTask: MultiTaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.multiTask.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
