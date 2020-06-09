import { Component } from '@angular/core';
import { Tag } from '../../../entities/tag';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';
import { TagService } from '../../../services/tag-service/tag.service';
import { Observable } from 'rxjs';
import { TagType } from '../../../entities/tag-type.enum';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.sass']
})
export class TagFormComponent {

  public tag: Tag;
  public tagTypes: string[] = [];
  public error = false;

  constructor(
    private tagService: TagService,
    private sidePanelData: SidePanelDataService
  ) {
    this.createTypeArray();
    this.setTag(null);
    sidePanelData.subscribe(tag => {
      this.setTag(tag != null ? Object.assign({}, tag) : null);
    });
  }

  public save(): void {
    let operation: Observable<Tag>;
    if (this.tag.id === 0) {
      operation = this.tagService.add(this.tag);
    } else {
      operation = this.tagService.edit(this.tag);
    }
    operation.subscribe(result => {
      if (result == null) {
        this.error = true;
      } else {
        this.sidePanelData.send(null);
      }
    });
  }

  public setTag( tag: Tag ): void {
    this.error = false;
    if (tag == null) {
      this.tag = new Tag(0, '');
    } else {
      this.tag = tag;
    }
  }

  private createTypeArray(): void {
    this.tagTypes = [];
    for (const val of Object.keys(TagType)) {
      if (!isNaN(+val)) {
        this.tagTypes[val] = TagType[val];
      }
    }
  }
}
