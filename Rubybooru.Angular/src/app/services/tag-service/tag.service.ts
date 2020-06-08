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

  public deleteTag( tag: Tag ): Observable<Tag> {
    return this.tagApi.delete(tag).pipe(
      tap(result => {
        if (result != null) {
          this.deleteFromCache(tag);
          // TODO: Delete from cache
        }
      })
    );
  }

  private deleteFromCache( tag: Tag ) {
    const query = this.tagApi.buildTagFilterQuery();
    const url = this.tagApi.getTagUrl() + query;
    let tags = this.cache.load(url);
    tags = tags.filter(t => t.id !== tag.id);
    this.cache.save({
      key: url,
      data: tags,
      expirationMins: environment.cacheTimeInMins
    });
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
      default:
        return 'general';
    }
  }
}
