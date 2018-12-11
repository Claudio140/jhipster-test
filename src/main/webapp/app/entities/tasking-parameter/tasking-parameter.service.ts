import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITaskingParameter } from 'app/shared/model/tasking-parameter.model';

type EntityResponseType = HttpResponse<ITaskingParameter>;
type EntityArrayResponseType = HttpResponse<ITaskingParameter[]>;

@Injectable({ providedIn: 'root' })
export class TaskingParameterService {
    public resourceUrl = SERVER_API_URL + 'api/tasking-parameters';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/tasking-parameters';

    constructor(private http: HttpClient) {}

    create(taskingParameter: ITaskingParameter): Observable<EntityResponseType> {
        return this.http.post<ITaskingParameter>(this.resourceUrl, taskingParameter, { observe: 'response' });
    }

    update(taskingParameter: ITaskingParameter): Observable<EntityResponseType> {
        return this.http.put<ITaskingParameter>(this.resourceUrl, taskingParameter, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ITaskingParameter>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ITaskingParameter[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ITaskingParameter[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
