import { Component, OnInit } from '@angular/core';
import { ImageApiService } from '../../../services/image-api/image-api.service';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';
import { Image } from '../../../entities/image';
import { Tag } from '../../../entities/tag';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { TagService } from '../../../services/tag-service/tag.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.sass']
})
export class ImagePanelComponent implements OnInit {

  public image: Image;
  public tags: Tag[] = [];
  public editMode = false;

  public allTags: Tag[] = [];

  public faTrash = faTrash;

  constructor(
    public imageApi: ImageApiService,
    private tagService: TagService,
    private sidePanelData: SidePanelDataService,
    private location: Location
  ) {
    sidePanelData.subscribe(data => this.onImage(data));
  }

  ngOnInit(): void {
    this.tagService.getTags().subscribe(tags => this.allTags = tags);
  }

  public toggleEditMode(): boolean {
    this.editMode = !this.editMode;
    return false;
  }

  public deleteImage(): boolean {
    if (confirm('Do you want to delete this image?')) {
      this.imageApi.delete(this.image.id).subscribe(() => {
        this.location.back();
      });
    }
    return false;
  }

  public addTag( tag: Tag ): void {
    this.imageApi.addTag(this.image.id, tag.id).subscribe(tags => {
      if (tags != null) {
        this.tags = tags;
      }
    });
  }

  public removeTag( tag: Tag ): void {
    this.imageApi.removeTag(this.image.id, tag.id).subscribe(tags => {
      if (tags != null) {
        this.tags = tags;
      }
    });
  }

  private onImage( image: Image ) {
    this.image = image;
    if (!image || !image.id) {
      return;
    }
    this.imageApi.getImageTags(image.id).subscribe(tags => {
      this.tags = tags;
    });
  }
}
