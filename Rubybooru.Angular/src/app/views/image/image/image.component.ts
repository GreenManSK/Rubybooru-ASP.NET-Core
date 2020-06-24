import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageApiService } from '../../../services/image-api/image-api.service';
import { Image } from '../../../entities/image';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.sass']
})
export class ImageComponent implements OnInit, OnDestroy {

  public image: Image;
  public isMini = true;

  constructor(
    private route: ActivatedRoute,
    public imageApi: ImageApiService,
    private sidePanelData: SidePanelDataService,
    private titleService: Title
  ) {
  }

  ngOnInit(): void {
    this.getImage();
    this.route.params.subscribe(params =>  this.getImage());
  }

  ngOnDestroy(): void {
    this.titleService.setTitle('Rubybooru');
  }

  public toggleMini(): void {
    this.isMini = !this.isMini;
  }

  private getImage(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.imageApi.getImage(id).subscribe(image => {
      this.image = image;
      this.sidePanelData.send(this.image);
      this.titleService.setTitle(image.name);
    });
  }
}
