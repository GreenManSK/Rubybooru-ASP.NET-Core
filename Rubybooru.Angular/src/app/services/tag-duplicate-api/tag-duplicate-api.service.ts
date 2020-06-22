import { Injectable } from '@angular/core';
import { RestApiService } from '../rest-api/rest-api.service';
import { HttpClientService } from '../http-client/http-client.service';
import { AlertService } from '../alert/alert.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagDuplicateApiService extends RestApiService {

  private readonly URL = 'tagduplicate';

  constructor( http: HttpClientService, alertService: AlertService ) {
    super(http, alertService);
  }

  public add( original: number, duplicate: number ): Observable<void> {
    const query = this.buildAddQuery(original, duplicate);
    return this.http.get<void>({
      url: this.getAddUrl() + query
    })
      .pipe(
        catchError(this.handleError(`add(${original},${duplicate})`, null))
      );
  }

  private getAddUrl() {
    return this.url + this.URL;
  }

  private buildAddQuery( originalId: number, duplicateId: number ) {
    let query = '?';

    if (originalId !== null) {
      query += 'originalId=' + originalId + '&';
    }

    if (duplicateId !== null) {
      query += 'duplicateId=' + duplicateId + '&';
    }

    return query;
  }
}
