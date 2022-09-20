import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Tag } from '../../entities/tag';
import { TagType } from '../../entities/tag-type.enum';
import { TagApiService } from '../tag-api/tag-api.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private static TYPES_SORT = environment.tagTypeOrder;

  constructor( private tagApi: TagApiService, private cache: CacheService ) {
  }

  public getTags(): Observable<Tag[]> {
    return this.tagApi.getTags();
  }

  public add( tag: Tag ): Observable<Tag> {
    return this.tagApi.add(tag).pipe(
      tap(result => {
        if (result != null) {
          this.addToCache(result);
        }
      })
    );
  }

  public edit( tag: Tag ): Observable<Tag> {
    return this.tagApi.update(tag).pipe(
      tap(result => {
        if (result != null) {
          this.updateInCache(tag);
        }
      })
    );
  }

  public delete( tag: Tag ): Observable<Tag> {
    return this.tagApi.delete(tag).pipe(
      tap(result => {
        if (result != null) {
          this.deleteFromCache(tag);
        }
      })
    );
  }

  private addToCache( tag: Tag ): void {
    const tags = this.getCacheTags();
    tags.push(tag);
    this.saveCache(tags);
  }

  private updateInCache( tag: Tag ): void {
    const tags = this.getCacheTags();
    for (const i in tags) {
      if (tags[i].id === tag.id) {
        tags[i] = tag;
      }
    }
    this.saveCache(tags);
  }

  private deleteFromCache( tag: Tag ): void {
    let tags = this.getCacheTags();
    tags = tags.filter(t => t.id !== tag.id);
    this.saveCache(tags);
  }

  private saveCache( tags: any ): void {
    this.cache.save({
      key: this.getCacheKey(),
      data: tags,
      expirationMins: environment.cacheTimeInMins
    });
  }

  private getCacheTags(): Tag[] {
    return this.cache.load(this.getCacheKey());
  }

  private getCacheKey(): string {
    const query = this.tagApi.buildTagFilterQuery();
    return this.tagApi.getTagUrl() + query;
  }

  public static sortTags( tags: Tag[] ): Tag[] {
    return tags.sort(( a: any, b: any ) => {
      if (a.type === b.type) {
        return b.count - a.count;
      }
      return TagService.TYPES_SORT.indexOf(a.type) < TagService.TYPES_SORT.indexOf(b.type) ? -1 : 1;
    });
  }

  public static getTagClass( tagType: TagType ): string {
    switch (tagType) {
      case TagType.Character:
        return 'character';
      case TagType.Copyright:
        return 'copyright';
      case TagType.System:
        return 'system';
      case TagType.Author:
        return 'author';
      default:
        return 'general';
    }
  }
}
