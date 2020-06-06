import { Component } from '@angular/core';
import { ImageApiService } from './services/image-api/image-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'rubybooru';

  constructor(imageApi: ImageApiService) {

  }
}
