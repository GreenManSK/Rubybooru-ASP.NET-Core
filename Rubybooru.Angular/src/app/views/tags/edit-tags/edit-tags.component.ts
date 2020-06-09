import { Component, OnInit } from '@angular/core';
import TrieSearch from 'trie-search';
import { TagService } from '../../../services/tag-service/tag.service';
import { Tag } from '../../../entities/tag';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.sass']
})
export class EditTagsComponent implements OnInit {

  public tags: Tag[] = [];
  public faTrash = faTrash;

  constructor(
    private tagService: TagService,
    private sidePanelData: SidePanelDataService
  ) {
    this.sidePanelData.subscribe(d => {
      if (d === null) {
        this.refreshTags();
      }
    });
  }

  ngOnInit(): void {
    this.refreshTags();
  }

  public selectTag( tag: Tag ): boolean {
    this.sidePanelData.send(tag);
    return false;
  }

  public deleteTag( tag: Tag ): boolean {
    this.tagService.delete(tag).subscribe(result => {
      if (result != null) {
        this.refreshTags();
      }
    });
    return false;
  }

  private refreshTags() {
    this.tagService.getTags().subscribe(tags => {
      this.tags = tags;
    });
  }
}
