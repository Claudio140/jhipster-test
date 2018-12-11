import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITaskExecution } from 'app/shared/model/task-execution.model';

type EntityResponseType = HttpResponse<ITaskExecution>;
type EntityArrayResponseType = HttpResponse<ITaskExecution[]>;

@Injectable({ providedIn: 'root' })
export class TaskExecutionService {
    public resourceUrl = SERVER_API_URL + 'api/task-executions';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/task-executions';

    constructor(private http: HttpClient) {}

    create(taskExecution: ITaskExecution): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(taskExecution);
        return this.http
            .post<ITaskExecution>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(taskExecution: ITaskExecution): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(taskExecution);
        return this.http
            .put<ITaskExecution>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ITaskExecution>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITaskExecution[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITaskExecution[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(taskExecution: ITaskExecution): ITaskExecution {
        const copy: ITaskExecution = Object.assign({}, taskExecution, {
            timestamp: taskExecution.timestamp != null && taskExecution.timestamp.isValid() ? taskExecution.timestamp.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.timestamp = res.body.timestamp != null ? moment(res.body.timestamp) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((taskExecution: ITaskExecution) => {
                taskExecution.timestamp = taskExecution.timestamp != null ? moment(taskExecution.timestamp) : null;
            });
        }
        return res;
    }
}
