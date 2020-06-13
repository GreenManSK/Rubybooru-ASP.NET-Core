import { Component, OnInit } from '@angular/core';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';
import { Image } from '../../../entities/image';
import { ImageApiService } from '../../../services/image-api/image-api.service';
import { Tag } from '../../../entities/tag';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-image-search-tags',
  templateUrl: './image-search-tags.component.html',
  styleUrls: ['./image-search-tags.component.sass']
})
export class ImageSearchTagsComponent implements OnInit {

  public tags: Tag[] = [];

  constructor(
    private imageApi: ImageApiService,
    private sidePanelData: SidePanelDataService
  ) {
    sidePanelData.subscribe(data => this.onImages(data));
  }

  ngOnInit(): void {
  }

  private onImages( images: Image[] ): void {
    if (!images || images.map === undefined) {
      return;
    }
    const ids = images.map(image => image.id);
    this.imageApi.getTags(ids).subscribe(tagMap => {
      this.tags = this.computeTagList(tagMap);
    });
  }

  private computeTagList( tagMap: { [key: string]: Tag[] } ): Tag[] {
    const tags = new Map<number, Tag>();

    for (const imageTags of Object.values<Tag[]>(tagMap)) {
      for (const tag of imageTags) {
        if (tags.has(tag.id)) {
          tags.get(tag.id).count += 1;
        } else {
          tag.count = 1;
          tags.set(tag.id, tag);
        }
      }
    }

    let result = Array.from(tags.values());
    result.sort(( a, b ) => b.count - a.count);

    result = result.slice(0, environment.displayTagCount);
    return result;
  }
}
