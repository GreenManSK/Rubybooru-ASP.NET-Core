import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Tag } from '../../entities/tag';
import { TagType } from '../../entities/tag-type.enum';
import { TagApiService } from '../tag-api/tag-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private static TYPES_SORT = environment.tagTypeOrder;

  constructor( private tagApi: TagApiService ) {
  }

  public getTags(): Observable<Tag[]> {
    return this.tagApi.getTags();
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
