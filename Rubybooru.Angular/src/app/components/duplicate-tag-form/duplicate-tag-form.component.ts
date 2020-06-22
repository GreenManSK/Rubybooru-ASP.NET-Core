import { Component, OnInit } from '@angular/core';
import { Tag } from '../../entities/tag';
import { TagService } from '../../services/tag-service/tag.service';
import { SidePanelDataService } from '../../services/side-panel-data/side-panel-data.service';

@Component({
  selector: 'app-duplicate-tag-form',
  templateUrl: './duplicate-tag-form.component.html',
  styleUrls: ['./duplicate-tag-form.component.sass']
})
export class DuplicateTagFormComponent implements OnInit {

  public tag: Tag;
  public tags: Tag[] = [];

  constructor(
    private tagService: TagService,
    private sidePanelData: SidePanelDataService
  ) {
    sidePanelData.subscribe(tag => {
      this.tag = tag;
    });
  }

  ngOnInit(): void {
    this.tagService.getTags().subscribe(tags => this.tags = tags);
  }

  public join( tag: Tag ): void {
    if (tag.id === this.tag.id) {
      return;
    }
    // Join duplicate
    this.sidePanelData.send(null);
  }
}
