import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITaskingCapability } from 'app/shared/model/tasking-capability.model';

type EntityResponseType = HttpResponse<ITaskingCapability>;
type EntityArrayResponseType = HttpResponse<ITaskingCapability[]>;

@Injectable({ providedIn: 'root' })
export class TaskingCapabilityService {
    public resourceUrl = SERVER_API_URL + 'api/tasking-capabilities';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/tasking-capabilities';

    constructor(private http: HttpClient) {}

    create(taskingCapability: ITaskingCapability): Observable<EntityResponseType> {
        return this.http.post<ITaskingCapability>(this.resourceUrl, taskingCapability, { observe: 'response' });
    }

    update(taskingCapability: ITaskingCapability): Observable<EntityResponseType> {
        return this.http.put<ITaskingCapability>(this.resourceUrl, taskingCapability, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ITaskingCapability>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ITaskingCapability[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ITaskingCapability[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
