import { Injectable } from '@angular/core';
import { RestApiService } from '../rest-api/rest-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Image } from '../../entities/image';
import { Tag } from '../../entities/tag';

@Injectable({
  providedIn: 'root'
})
export class ImageApiService extends RestApiService {

  private readonly IMAGE_GET = 'image';

  constructor( http: HttpClient ) {
    super(http);
  }

  public getImages( limit: number, offset: number = 0, tags: number[] = null ): Observable<Image[]> {
    const query = this.buildImageFilterQuery(limit, offset, tags);
    return this.http.get<Image[]>(this.getImageUrl() + query)
      .pipe(
        catchError(this.handleError('getImages', []))
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

  public getImage( id: number ): Observable<Image> {
    return this.http.get<Image>(this.getImageUrl(id)).pipe(
      catchError(this.handleError<Image>('getImage(' + id + ')', null))
    );
  }

  public getImageTags( id: number ): Observable<Tag> {
    return this.http.get<Tag>(this.getImageTagsUrl(id)).pipe(
      catchError(this.handleError<Tag>('getImageTags(' + id + ')', null))
    );
  }

  public getTags( ids: number[] ): Observable<Map<number, Tag[]>> {
    return this.http.get<Map<number, Tag[]>>(this.getTagsUrl(ids)).pipe(
      catchError(this.handleError<Map<number, Tag[]>>('getTags(' + ids + ')', null))
    );
  }

  public getImageFileUrl( id: number ): string {
    return this.getImageUrl(id) + '/file';
  }

  public getImagePreviewUrl( id: number, width: number, height: number, keepAspectRatio: boolean = true ): string {
    return this.getImageUrl(id) + '/preview?width=' + width + '&height=' + height + '&keepAspectRatio=' + keepAspectRatio;
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
}
