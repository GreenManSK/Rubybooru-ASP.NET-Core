import { Component, OnInit } from '@angular/core';
import { ImageApiService } from '../../../services/image-api/image-api.service';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';
import { Image } from '../../../entities/image';
import { Tag } from '../../../entities/tag';

@Component({
  selector: 'app-image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.sass']
})
export class ImagePanelComponent implements OnInit {

  public image: Image;
  public tags: Tag[] = [];

  constructor(
    public imageApi: ImageApiService,
    private sidePanelData: SidePanelDataService
  ) {
    sidePanelData.subscribe(data => this.onImage(data));
  }

  ngOnInit(): void {
  }

  private onImage( image: Image ) {
    this.image = image;
    this.imageApi.getImageTags(image.id).subscribe(tags => {
      this.tags = tags;
    })
  }
}
