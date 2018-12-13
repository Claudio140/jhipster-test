import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITask } from 'app/shared/model/task.model';

type EntityResponseType = HttpResponse<ITask>;
type EntityArrayResponseType = HttpResponse<ITask[]>;

@Injectable({ providedIn: 'root' })
export class TaskService {
    public resourceUrl = SERVER_API_URL + 'api/tasks';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/tasks';

    constructor(private http: HttpClient) {}

    create(task: ITask): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(task);
        return this.http
            .post<ITask>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(task: ITask): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(task);
        return this.http
            .put<ITask>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ITask>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITask[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITask[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(task: ITask): ITask {
        const copy: ITask = Object.assign({}, task, {
            creationTime: task.creationTime != null && task.creationTime.isValid() ? task.creationTime.toJSON() : null,
            executionTime: task.executionTime != null && task.executionTime.isValid() ? task.executionTime.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.creationTime = res.body.creationTime != null ? moment(res.body.creationTime) : null;
            res.body.executionTime = res.body.executionTime != null ? moment(res.body.executionTime) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((task: ITask) => {
                task.creationTime = task.creationTime != null ? moment(task.creationTime) : null;
                task.executionTime = task.executionTime != null ? moment(task.executionTime) : null;
            });
        }
        return res;
    }
}
