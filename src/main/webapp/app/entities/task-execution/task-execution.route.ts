import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TaskExecution } from 'app/shared/model/task-execution.model';
import { TaskExecutionService } from './task-execution.service';
import { TaskExecutionComponent } from './task-execution.component';
import { TaskExecutionDetailComponent } from './task-execution-detail.component';
import { TaskExecutionUpdateComponent } from './task-execution-update.component';
import { TaskExecutionDeletePopupComponent } from './task-execution-delete-dialog.component';
import { ITaskExecution } from 'app/shared/model/task-execution.model';

@Injectable({ providedIn: 'root' })
export class TaskExecutionResolve implements Resolve<ITaskExecution> {
    constructor(private service: TaskExecutionService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskExecution> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<TaskExecution>) => response.ok),
                map((taskExecution: HttpResponse<TaskExecution>) => taskExecution.body)
            );
        }
        return of(new TaskExecution());
    }
}

export const taskExecutionRoute: Routes = [
    {
        path: 'task-execution',
        component: TaskExecutionComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskExecution.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'task-execution/:id/view',
        component: TaskExecutionDetailComponent,
        resolve: {
            taskExecution: TaskExecutionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskExecution.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'task-execution/new',
        component: TaskExecutionUpdateComponent,
        resolve: {
            taskExecution: TaskExecutionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskExecution.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'task-execution/:id/edit',
        component: TaskExecutionUpdateComponent,
        resolve: {
            taskExecution: TaskExecutionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskExecution.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const taskExecutionPopupRoute: Routes = [
    {
        path: 'task-execution/:id/delete',
        component: TaskExecutionDeletePopupComponent,
        resolve: {
            taskExecution: TaskExecutionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskExecution.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
