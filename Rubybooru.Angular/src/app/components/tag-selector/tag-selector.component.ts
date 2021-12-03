import { Component, EventEmitter, Input, Output } from '@angular/core';
import TrieSearch from 'trie-search';
import { Tag } from '../../entities/tag';
import { TagService } from 'src/app/services/tag-service/tag.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.sass']
})
export class TagSelectorComponent {

  @Output()
  public tagCallback: EventEmitter<Tag> = new EventEmitter();

  @Input()
  public tagIcon: IconDefinition = null;

  @Output()
  public tagIconCallback: EventEmitter<Tag> = new EventEmitter();

  @Input()
  public tagClasses: string;

  @Input()
  public enablePreview = false;

  public TagService = TagService;
  public filteredTags: Tag[] = [];
  public previewIcon = faEye;

  private trieSearch: TrieSearch;
  private lastSearch = '';

  constructor() {
    this.trieSearch = new TrieSearch('name');
  }

  public onTagClick( tag: Tag ): boolean {
    this.tagCallback.emit(tag);
    return false;
  }

  public onTagIconClick( tag: Tag ): boolean {
    if (this.tagIconCallback != null) {
      this.tagIconCallback.emit(tag);
    }
    return false;
  }

  @Input()
  public set tags( tags: Tag[] ) {
    this.createTrie(tags);
  }

  public valueChange( value: string ): void {
    this.lastSearch = value;
    this.filteredTags = this.trieSearch.get(value.trim());
  }

  private createTrie( tags: Tag[] ): void {
    this.trieSearch = new TrieSearch('name', {
      min: 1,
      splitOnRegEx: /_/g
    });
    this.trieSearch.addAll(tags);
    if (this.lastSearch !== '') {
      this.valueChange(this.lastSearch);
    }
  }

}
