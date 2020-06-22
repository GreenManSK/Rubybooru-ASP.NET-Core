import { Injectable } from '@angular/core';
import { RestApiService } from '../rest-api/rest-api.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TagType } from '../../entities/tag-type.enum';
import { Tag } from '../../entities/tag';
import { SortType } from './sort-type';
import { HttpClientService } from '../http-client/http-client.service';
import { environment } from '../../../environments/environment';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class TagApiService extends RestApiService {

  private readonly TAG_GET = 'tag';


  constructor( http: HttpClientService, alertService: AlertService ) {
    super(http, alertService);
  }

  public getTags( limit: number = 0, offset: number = 0, sort: SortType = SortType.Name, type: TagType = null ): Observable<Tag[]> {
    const query = this.buildTagFilterQuery(limit, offset, sort, type);
    return this.http.get<Tag[]>({
      url: this.getTagUrl() + query,
      cacheMins: environment.cacheTimeInMins
    })
      .pipe(
        catchError(this.handleError(`getTags(${limit},${offset},${sort},${type})`, []))
      );
  }

  public getTag( id: number ): Observable<Tag> {
    return this.http.get<Tag>({
      url: this.getTagUrl(id)
    })
      .pipe(
        catchError(this.handleError(`getTag(${id})`, null))
      );
  }

  public parseTags( names: string[] ): Observable<Tag[]> {
    return this.http.get<Tag[]>({
      url: this.getParseTagsUrl(names)
    })
      .pipe(
        catchError(this.handleError(`parseTags(${names})`, []))
      );
  }

  public add( tag: Tag ): Observable<Tag> {
    return this.http.post<Tag>({
      url: this.getTagUrl(),
      body: tag
    })
      .pipe(
        catchError(this.handleError(`add(${tag})`, null))
      );
  }

  public update( tag: Tag ): Observable<Tag> {
    return this.http.put<Tag>({
      url: this.getTagUrl(tag.id),
      body: tag
    })
      .pipe(
        catchError(this.handleError(`update(${tag})`, null))
      );
  }

  public delete( tag: Tag ): Observable<Tag> {
    return this.http.delete<Tag>({
      url: this.getTagUrl(tag.id)
    })
      .pipe(
        catchError(this.handleError(`delete(${tag})`, null))
      );
  }

  public buildTagFilterQuery( limit: number = 0, offset: number = 0, sort: SortType = SortType.Name, type: TagType = null ): string {
    let query = '?';

    if (limit !== null) {
      query += 'limit=' + limit + '&';
    }

    if (offset !== null) {
      query += 'offset=' + offset + '&';
    }

    if (sort !== null) {
      query += 'sortOrder=' + sort + '&';
    }

    if (type !== null) {
      query += 'tagType=' + type + '&';
    }

    return query;
  }

  public getTagUrl( id: number = null ): string {
    return this.url + this.TAG_GET + (id !== null ? '/' + id : '');
  }

  private getParseTagsUrl( names: string[] ): string {
    let query = '?';
    names.forEach(n => query += 'names=' + n + '&');
    return this.url + this.TAG_GET + '/name' + query;
  }
}
