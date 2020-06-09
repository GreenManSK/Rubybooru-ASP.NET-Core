import { Injectable } from '@angular/core';
import { RestApiService } from '../rest-api/rest-api.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Image } from '../../entities/image';
import { Tag } from '../../entities/tag';
import { HttpClientService } from '../http-client/http-client.service';
import { environment } from '../../../environments/environment';
import { TagType } from '../../entities/tag-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ImageApiService extends RestApiService {

  private readonly IMAGE_GET = 'image';

  constructor( http: HttpClientService ) {
    super(http);
  }

  public getImages( limit: number, offset: number = 0, tags: number[] = null ): Observable<Image[]> {
    const query = this.buildImageFilterQuery(limit, offset, tags);
    return this.http.get<Image[]>({
      url: this.getImageUrl() + query
    })
      .pipe(
        catchError(this.handleError('getImages', []))
      );
  }

  public getCount( tags: number[] = null ): Observable<number> {
    const query = this.buildImageFilterQuery(null, null, tags);
    return this.http.get<number>({
      url: this.getCountUrl() + query,
      cacheMins: environment.cacheTimeInMins
    })
      .pipe(
        catchError(this.handleError('getCount', 0))
      );
  }

  private buildImageFilterQuery( limit: number, offset: number, tags: number[] ) {
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

    return query;
  }

  public getWithoutTagType( limit: number, offset: number, tagType: TagType ): Observable<Image[]> {
    const query = this.buildWithoutTagFilterQuery(limit, offset, tagType);
    return this.http.get<Image[]>({
      url: this.getWithoutTagTypeUrl() + query
    })
      .pipe(
        catchError(this.handleError('getWithoutTagType', []))
      );
  }

  public getWithoutTagTypeCount( tagType: TagType ): Observable<number> {
    const query = this.buildWithoutTagFilterQuery(null, null, tagType);
    return this.http.get<number>({
      url: this.getWithoutTagTypeCountUrl() + query
    })
      .pipe(
        catchError(this.handleError('getWithoutTagType', 0))
      );
  }

  private buildWithoutTagFilterQuery( limit: number, offset: number, tagType: TagType ): string {
    let query = '?';

    if (limit !== null) {
      query += 'limit=' + limit + '&';
    }

    if (offset !== null) {
      query += 'offset=' + offset + '&';
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
}
