import { Component, Input, OnInit } from '@angular/core';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
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

  constructor() {
  }

  ngOnInit(): void {
  }

  @Input()
  public set tags( tags: Tag[] ) {
    this.sortedTags = TagService.sortTags(tags);
  }
}
