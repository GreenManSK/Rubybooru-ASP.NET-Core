import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../services/cache/cache.service';

@Component({
  selector: 'app-refresh-catche-button',
  templateUrl: './refresh-catche-button.component.html',
  styleUrls: ['./refresh-catche-button.component.sass']
})
export class RefreshCatcheButtonComponent implements OnInit {

  constructor(private cacheService: CacheService) {

  }

  ngOnInit(): void {
  }

  public onClick(): boolean {
    this.cacheService.cleanLocalStorage();
    location.reload();
    return false;
  }
}
