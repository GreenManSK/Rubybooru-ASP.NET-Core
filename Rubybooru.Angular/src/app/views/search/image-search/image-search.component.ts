import { Component, OnInit } from '@angular/core';
import { Image } from '../../../entities/image';
import { ImageApiService } from '../../../services/image-api/image-api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.sass']
})
export class ImageSearchComponent implements OnInit {

  public images: Image[];
  public page: number;

  constructor( private imageApi: ImageApiService ) {
  }

  ngOnInit(): void {
    this.imageApi.getImages(environment.imagesPerPage).subscribe(images => {
      this.images = images;
    });
  }

}
