import { Injectable } from '@angular/core';
import { RestApiService } from '../rest-api/rest-api.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Image } from '../../entities/image';
import { Tag } from '../../entities/tag';
import { HttpClientService } from '../http-client/http-client.service';
import { environment } from '../../../environments/environment';
import { TagType } from '../../entities/tag-type.enum';
import { SizeCondition } from '../../data/size-condition';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ImageApiService extends RestApiService {

  private readonly IMAGE_GET = 'image';

  constructor( http: HttpClientService, alertService: AlertService ) {
    super(http, alertService);
  }

  public getImages(
    limit: number,
    offset: number = 0,
    tags: number[] = null,
    sizeConditions:
      SizeCondition[] = null
  ): Observable<Image[]> {
    const query = this.buildImageFilterQuery(limit, offset, tags, sizeConditions);
    return this.http.get<Image[]>({
      url: this.getImageUrl() + query
    })
      .pipe(
        catchError(this.handleError(`getImages(${limit},${offset},${tags},${sizeConditions})`, []))
      );
  }

  public getCount( tags: number[] = null, sizeConditions: SizeCondition[] = null ): Observable<number> {
    const query = this.buildImageFilterQuery(null, null, tags, sizeConditions);
    return this.http.get<number>({
      url: this.getCountUrl() + query,
      cacheMins: environment.cacheTimeInMins
    })
      .pipe(
        catchError(this.handleError(`getCount(${tags},${sizeConditions})`, 0))
      );
  }

  private buildImageFilterQuery( limit: number, offset: number, tags: number[], sizeConditions: SizeCondition[] = null ) {
    let query = '?';

    if (limit !== null) {
      query += 'limit=' + limit + '&';
    }

    if (offset !== null) {
      query += 'offset=' + offset + '&';
    }

    if (tags) {
      tags.forEach(t => query += 'withTags=' + t + '&');
    }

    if (sizeConditions != null) {
      sizeConditions.forEach(c => query += 'sizeConditions=' + JSON.stringify(c) + '&');
    }

    return query;
  }

  public getWithoutTagType( limit: number, offset: number, tagType: TagType, year?: number ): Observable<Image[]> {
    const query = this.buildWithoutTagFilterQuery(limit, offset, tagType, year);
    return this.http.get<Image[]>({
      url: this.getWithoutTagTypeUrl() + query
    })
      .pipe(
        catchError(this.handleError(`getWithoutTagType(${limit},${offset},${tagType})`, []))
      );
  }

  public getWithoutTagTypeCount( tagType: TagType, year?: number ): Observable<number> {
    const query = this.buildWithoutTagFilterQuery(null, null, tagType, year);
    return this.http.get<number>({
      url: this.getWithoutTagTypeCountUrl() + query
    })
      .pipe(
        catchError(this.handleError(`getWithoutTagType(${tagType})`, 0))
      );
  }

  public getWithoutTagTypeYears( tagType: TagType ): Observable<number[]> {
    return this.http.get<number[]>({
      url: this.getWithoutTagTypeYearsUrl()
    })
      .pipe(
        catchError(this.handleError(`getWithoutTagTypeYears(${tagType})`, []))
      );
  }

  private buildWithoutTagFilterQuery( limit: number, offset: number, tagType: TagType, year?: number ): string {
    let query = '?';

    if (limit !== null) {
      query += 'limit=' + limit + '&';
    }

    if (offset !== null) {
      query += 'offset=' + offset + '&';
    }

    if (year) {
      query += 'year=' + year + '&';
    }

    if (tagType != null) {
      query += 'tagType=' + tagType;
    }

    return query;
  }

  public getImage( id: number ): Observable<Image> {
    return this.http.get<Image>({
      url: this.getImageUrl(id)
    }).pipe(
      catchError(this.handleError<Image>('getImage(' + id + ')', null))
    );
  }

  public delete( id: number ): Observable<Image> {
    return this.http.delete<Image>({
      url: this.getImageUrl(id)
    })
      .pipe(
        catchError(this.handleError(`delete(${id})`, null))
      );
  }

  public getImageTags( id: number ): Observable<Tag[]> {
    return this.http.get<Tag[]>({
      url: this.getImageTagsUrl(id)
    }).pipe(
      catchError(this.handleError<Tag[]>('getImageTags(' + id + ')', []))
    );
  }

  public getTags( ids: number[] ): Observable<{ [key: string]: Tag[] }> {
    return this.http.get<{ [key: string]: Tag[] }>({
      url: this.getTagsUrl(ids)
    }).pipe(
      catchError(this.handleError<{ [key: string]: Tag[] }>('getTags(' + ids + ')', {}))
    );
  }

  public getImageFileUrl( id: number ): string {
    return this.getImageUrl(id) + '/file';
  }

  public getImagePreviewUrl( id: number, width: number, height: number, keepAspectRatio: boolean = true ): string {
    return this.getImageUrl(id) + '/preview?width=' + width + '&height=' + height + '&keepAspectRatio=' + keepAspectRatio;
  }

  public addTag( imageId: number, tagId: number ): Observable<Tag[]> {
    return this.http.post<Tag[]>({
      url: this.getImageTagUrl(imageId, tagId)
    }).pipe(
      catchError(this.handleError<Tag[]>('addTag(' + imageId + ', ' + tagId + ')', null))
    );
  }

  public removeTag( imageId: number, tagId: number ): Observable<Tag[]> {
    return this.http.delete<Tag[]>({
      url: this.getImageTagUrl(imageId, tagId)
    }).pipe(
      catchError(this.handleError<Tag[]>('addTag(' + imageId + ', ' + tagId + ')', null))
    );
  }

  public randomId(): Observable<number> {
    return this.http.get<number>({
      url: this.getRandomIdUrl()
    }).pipe(
      catchError(this.handleError<number>('randomId()', 0))
    );
  }

  public randomFilteredId( tags: number[] = null, sizeConditions: SizeCondition[] = null ): Observable<number> {
    const query = this.buildImageFilterQuery(null, null, tags, sizeConditions);
    return this.http.get<number>({
      url: this.getRandomIdUrl() + query
    }).pipe(
      catchError(this.handleError<number>('randomFilteredId()', 0))
    );
  }

  private getImageUrl( id: number = null ): string {
    return this.url + this.IMAGE_GET + (id !== null ? '/' + id : '');
  }

  private getImageTagsUrl( id: number ): string {
    return this.getImageUrl(id) + '/tag';
  }

  private getTagsUrl( ids: number[] ): string {
    let query = '';
    ids.forEach(t => query += 'ids=' + t + '&');
    return this.getImageUrl() + '/tags?' + query;
  }

  private getImageTagUrl( imageId: number, tagId: number ): string {
    return this.getImageTagsUrl(imageId) + '/' + tagId;
  }

  private getCountUrl(): string {
    return this.getImageUrl() + '/count';
  }

  private getWithoutTagTypeUrl(): string {
    return this.getImageUrl() + '/without-tag';
  }

  private getWithoutTagTypeCountUrl(): string {
    return this.getWithoutTagTypeUrl() + '/count';
  }

  private getWithoutTagTypeYearsUrl(): string {
    return this.getWithoutTagTypeUrl() + '/years';
  }

  private getRandomIdUrl() {
    return this.getImageUrl() + '/random';
  }
}
