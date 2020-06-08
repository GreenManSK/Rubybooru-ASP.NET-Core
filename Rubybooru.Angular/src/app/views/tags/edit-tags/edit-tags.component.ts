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

  public TagService = TagService;
  public tags: Tag[] = [];
  public faTrash = faTrash;

  private trieSearch: TrieSearch;
  private lastSearch = '';

  constructor(
    private tagService: TagService,
    private sidePanelData: SidePanelDataService
  ) {
    this.trieSearch = new TrieSearch('name');
  }

  ngOnInit(): void {
    this.createTrie();
  }

  public valueChange( value: string ): void {
    this.lastSearch = value;
    this.tags = this.trieSearch.get(value);
  }

  public selectTag( tag: Tag ): boolean {
    this.sidePanelData.send(tag);
    return false;
  }

  public deleteTag( tag: Tag ): boolean {
    this.tagService.deleteTag(tag).subscribe(result => {
      if (result != null) {
        this.createTrie(true);
      }
    });
    return false;
  }

  private createTrie(refresh = false): void {
    this.tagService.getTags().subscribe(tags => {
      this.trieSearch = new TrieSearch('name');
      this.trieSearch.addAll(tags);
      if (refresh && this.lastSearch !== '') {
        this.valueChange(this.lastSearch);
      }
    });
  }
}
