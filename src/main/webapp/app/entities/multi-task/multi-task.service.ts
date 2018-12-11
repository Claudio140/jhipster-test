import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMultiTask } from 'app/shared/model/multi-task.model';

type EntityResponseType = HttpResponse<IMultiTask>;
type EntityArrayResponseType = HttpResponse<IMultiTask[]>;

@Injectable({ providedIn: 'root' })
export class MultiTaskService {
    public resourceUrl = SERVER_API_URL + 'api/multi-tasks';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/multi-tasks';

    constructor(private http: HttpClient) {}

    create(multiTask: IMultiTask): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(multiTask);
        return this.http
            .post<IMultiTask>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(multiTask: IMultiTask): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(multiTask);
        return this.http
            .put<IMultiTask>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IMultiTask>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IMultiTask[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IMultiTask[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(multiTask: IMultiTask): IMultiTask {
        const copy: IMultiTask = Object.assign({}, multiTask, {
            creationTime: multiTask.creationTime != null && multiTask.creationTime.isValid() ? multiTask.creationTime.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.creationTime = res.body.creationTime != null ? moment(res.body.creationTime) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((multiTask: IMultiTask) => {
                multiTask.creationTime = multiTask.creationTime != null ? moment(multiTask.creationTime) : null;
            });
        }
        return res;
    }
}
