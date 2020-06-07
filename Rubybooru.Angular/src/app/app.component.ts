import { Component, HostListener } from '@angular/core';
import { CacheService } from './services/cache/cache.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'rubybooru';

  constructor(private cacheService: CacheService) {

  }

  @HostListener('window:keydown', ['$event'])
  keyEvent( event: KeyboardEvent ) {
    if (event.ctrlKey && event.key === 'F5') {
      this.cacheService.cleanLocalStorage();
    }
  }
}
