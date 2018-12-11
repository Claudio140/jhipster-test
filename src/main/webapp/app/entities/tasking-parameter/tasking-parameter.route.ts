import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TaskingParameter } from 'app/shared/model/tasking-parameter.model';
import { TaskingParameterService } from './tasking-parameter.service';
import { TaskingParameterComponent } from './tasking-parameter.component';
import { TaskingParameterDetailComponent } from './tasking-parameter-detail.component';
import { TaskingParameterUpdateComponent } from './tasking-parameter-update.component';
import { TaskingParameterDeletePopupComponent } from './tasking-parameter-delete-dialog.component';
import { ITaskingParameter } from 'app/shared/model/tasking-parameter.model';

@Injectable({ providedIn: 'root' })
export class TaskingParameterResolve implements Resolve<ITaskingParameter> {
    constructor(private service: TaskingParameterService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskingParameter> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<TaskingParameter>) => response.ok),
                map((taskingParameter: HttpResponse<TaskingParameter>) => taskingParameter.body)
            );
        }
        return of(new TaskingParameter());
    }
}

export const taskingParameterRoute: Routes = [
    {
        path: 'tasking-parameter',
        component: TaskingParameterComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskingParameter.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'tasking-parameter/:id/view',
        component: TaskingParameterDetailComponent,
        resolve: {
            taskingParameter: TaskingParameterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskingParameter.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'tasking-parameter/new',
        component: TaskingParameterUpdateComponent,
        resolve: {
            taskingParameter: TaskingParameterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskingParameter.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'tasking-parameter/:id/edit',
        component: TaskingParameterUpdateComponent,
        resolve: {
            taskingParameter: TaskingParameterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskingParameter.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const taskingParameterPopupRoute: Routes = [
    {
        path: 'tasking-parameter/:id/delete',
        component: TaskingParameterDeletePopupComponent,
        resolve: {
            taskingParameter: TaskingParameterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskingParameter.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
