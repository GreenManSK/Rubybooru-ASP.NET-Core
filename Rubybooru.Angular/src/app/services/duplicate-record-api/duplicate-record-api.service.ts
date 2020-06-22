import { Injectable } from '@angular/core';
import { RestApiService } from '../rest-api/rest-api.service';
import { HttpClientService } from '../http-client/http-client.service';
import { Observable } from 'rxjs';
import { DuplicateRecord } from '../../entities/duplicate-record';
import { catchError } from 'rxjs/operators';
import { DuplicateRecordResolution } from '../../data/duplicate-record-resolution';

@Injectable({
  providedIn: 'root'
})
export class DuplicateRecordApiService extends RestApiService {

  private readonly RECORD_GET = 'duplicaterecord';

  constructor( http: HttpClientService ) {
    super(http);
  }

  public getRecords( limit: number = 0, offset: number = 0 ): Observable<DuplicateRecord[]> {
    const query = this.buildRecordFilterQuery(limit, offset);
    return this.http.get<DuplicateRecord[]>({
      url: this.getRecordUrl() + query
    })
      .pipe(
        catchError(this.handleError('getRecords', []))
      );
  }

  public getRecordsCount(): Observable<number> {
    return this.http.get<number>({
      url: this.getRecordsCountUrl()
    })
      .pipe(
        catchError(this.handleError('getRecordsCount', 0))
      );
  }

  public getRecord( id: number ): Observable<DuplicateRecord> {
    return this.http.get<DuplicateRecord>({
      url: this.getRecordUrl(id)
    })
      .pipe(
        catchError(this.handleError('getRecord', null))
      );
  }

  public resolve( id: number, resolution: DuplicateRecordResolution, mergeTags: boolean ): Observable<void> {
    return this.http.get<DuplicateRecord>({
      url: this.getResolveUrl(id, resolution, mergeTags)
    })
      .pipe(
        catchError(this.handleError('resolve', null))
      );
  }

  private buildRecordFilterQuery( limit: number, offset: number ): string {
    let query = '?';

    if (limit !== null) {
      query += 'limit=' + limit + '&';
    }

    if (offset !== null) {
      query += 'offset=' + offset + '&';
    }

    return query;
  }

  private getRecordUrl( id: number = null ): string {
    return this.url + this.RECORD_GET + (id !== null ? '/' + id : '');
  }

  private getRecordsCountUrl(): string {
    return this.getRecordUrl() + '/count';
  }

  private getResolveUrl( id: number, resolution: DuplicateRecordResolution, mergeTags: boolean ) {
    return this.getRecordUrl() + '/resolve/' + id + '?resolution=' + resolution + '&mergeTags=' + mergeTags;
  }
}
