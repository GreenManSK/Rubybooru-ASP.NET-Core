import { Component, Input, OnInit } from '@angular/core';
import { Image } from '../../entities/image';
import { ImageApiService } from '../../services/image-api/image-api.service';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.sass']
})
export class ImageGridComponent implements OnInit {

  public readonly TMP_WIDTH = 350;
  public readonly TMP_HEIGHT = 180;

  @Input() images: Image[] = [];

  constructor(public imageApi: ImageApiService) {
  }

  ngOnInit(): void {
  }

}
