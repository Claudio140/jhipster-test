import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TaskingCapability } from 'app/shared/model/tasking-capability.model';
import { TaskingCapabilityService } from './tasking-capability.service';
import { TaskingCapabilityComponent } from './tasking-capability.component';
import { TaskingCapabilityDetailComponent } from './tasking-capability-detail.component';
import { TaskingCapabilityUpdateComponent } from './tasking-capability-update.component';
import { TaskingCapabilityDeletePopupComponent } from './tasking-capability-delete-dialog.component';
import { ITaskingCapability } from 'app/shared/model/tasking-capability.model';

@Injectable({ providedIn: 'root' })
export class TaskingCapabilityResolve implements Resolve<ITaskingCapability> {
    constructor(private service: TaskingCapabilityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskingCapability> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<TaskingCapability>) => response.ok),
                map((taskingCapability: HttpResponse<TaskingCapability>) => taskingCapability.body)
            );
        }
        return of(new TaskingCapability());
    }
}

export const taskingCapabilityRoute: Routes = [
    {
        path: 'tasking-capability',
        component: TaskingCapabilityComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskingCapability.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'tasking-capability/:id/view',
        component: TaskingCapabilityDetailComponent,
        resolve: {
            taskingCapability: TaskingCapabilityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskingCapability.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'tasking-capability/new',
        component: TaskingCapabilityUpdateComponent,
        resolve: {
            taskingCapability: TaskingCapabilityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskingCapability.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'tasking-capability/:id/edit',
        component: TaskingCapabilityUpdateComponent,
        resolve: {
            taskingCapability: TaskingCapabilityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskingCapability.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const taskingCapabilityPopupRoute: Routes = [
    {
        path: 'tasking-capability/:id/delete',
        component: TaskingCapabilityDeletePopupComponent,
        resolve: {
            taskingCapability: TaskingCapabilityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'permaApp.taskingCapability.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
