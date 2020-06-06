import { Component } from '@angular/core';
import { TagApiService } from './services/tag-api/tag-api.service';
import { Tag } from './entities/tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'rubybooru';

  constructor( tagApiService: TagApiService ) {
    const tag = new Tag();
    tag.Id = 10003;
    tag.Name = 'Hallioooo';
    tagApiService.delete(tag).subscribe(tags => {
      console.log(tags);
    });
  }
}
