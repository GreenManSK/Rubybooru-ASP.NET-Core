import { Injectable } from '@angular/core';
import { RestApiService } from '../rest-api/rest-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TagType } from '../../entities/tag-type.enum';
import { Tag } from '../../entities/tag';
import { SortType } from './sort-type';

@Injectable({
  providedIn: 'root'
})
export class TagApiService extends RestApiService {

  private readonly TAG_GET = 'tag';

  constructor( http: HttpClient ) {
    super(http);
  }

  public getTags( limit: number, offset: number = 0, sort: SortType = SortType.Name, type: TagType = null ): Observable<Tag[]> {
    const query = this.buildTagFilterQuery(limit, offset, sort, type);
    return this.http.get<Tag[]>(this.getTagUrl() + query)
      .pipe(
        catchError(this.handleError('getTags', []))
      );
  }

  public getTag( id: number ): Observable<Tag> {
    return this.http.get<Tag>(this.getTagUrl(id))
      .pipe(
        catchError(this.handleError('getTag', null))
      );
  }

  public parseTags( names: string[] ): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.getParseTagsUrl(names))
      .pipe(
        catchError(this.handleError('parseTags', []))
      );
  }

  public add( tag: Tag ): Observable<Tag> {
    return this.http.post<Tag>(this.getTagUrl(), tag)
      .pipe(
        catchError(this.handleError('add', null))
      );
  }

  public update( tag: Tag ): Observable<Tag> {
    return this.http.put<Tag>(this.getTagUrl(tag.Id), tag)
      .pipe(
        catchError(this.handleError('update', null))
      );
  }

  public delete( tag: Tag ): Observable<Tag> {
    return this.http.delete<Tag>(this.getTagUrl(tag.Id))
      .pipe(
        catchError(this.handleError('delete', null))
      );
  }

  private buildTagFilterQuery( limit: number, offset: number, sort: SortType, type: TagType ): string {
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

  private getTagUrl( id: number = null ): string {
    return this.url + this.TAG_GET + (id !== null ? '/' + id : '');
  }

  private getParseTagsUrl( names: string[] ): string {
    let query = '?';
    names.forEach(n => query += 'names=' + n + '&');
    return this.url + this.TAG_GET + '/name' + query;
  }
}
