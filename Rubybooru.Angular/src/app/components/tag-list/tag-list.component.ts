import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faQuestion, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Tag } from '../../entities/tag';
import { TagService } from '../../services/tag-service/tag.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.sass']
})
export class TagListComponent implements OnInit {

  public sortedTags: Tag[] = [];
  public faSquare = faQuestion;

  public TagService = TagService;

  @Input()
  public tagIcon: IconDefinition = null;
  @Output()
  public tagIconCallback: EventEmitter<Tag> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  @Input()
  public set tags( tags: Tag[] ) {
    this.sortedTags = TagService.sortTags(tags);
  }

  public callback( tag: Tag ): boolean {
    this.tagIconCallback.emit(tag);
    return false;
  }
}
