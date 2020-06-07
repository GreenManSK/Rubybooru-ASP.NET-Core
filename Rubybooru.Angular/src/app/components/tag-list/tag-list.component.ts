import { Component, Input, OnInit } from '@angular/core';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Tag } from '../../entities/tag';
import { TagType } from '../../entities/tag-type.enum';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.sass']
})
export class TagListComponent implements OnInit {

  private static TYPES_SORT = environment.tagTypeOrder;

  public sortedTags: Tag[] = [];
  public faSquare = faQuestion;

  constructor() {
  }

  ngOnInit(): void {
  }

  @Input()
  public set tags( tags: Tag[] ) {
    this.sortedTags = this.sortTags(tags);
  }

  private sortTags( tags: Tag[] ): Tag[] {
    return tags.sort(( a: any, b: any ) => {
      if (a.type === b.type) {
        return b.count - a.count;
      }
      return TagListComponent.TYPES_SORT.indexOf(a.type)
      < TagListComponent.TYPES_SORT.indexOf(b.type) ? -1 : 1;
    });
  }

  public getTagClass( tagType: TagType ): string {
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
