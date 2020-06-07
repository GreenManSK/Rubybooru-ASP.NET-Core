import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageApiService } from '../../../services/image-api/image-api.service';
import { Image } from '../../../entities/image';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.sass']
})
export class ImageComponent implements OnInit {

  public image: Image;
  public isMini = true;

  constructor(
    private route: ActivatedRoute,
    public imageApi: ImageApiService,
    private sidePanelData: SidePanelDataService
  ) {
  }

  ngOnInit(): void {
    this.getImage();
  }

  public toggleMini(): void {
    this.isMini = !this.isMini;
  }

  private getImage(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.imageApi.getImage(id).subscribe(image => {
      this.image = image;
      this.sidePanelData.send(this.image);
    });
  }
}
