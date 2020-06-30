import { Injectable } from '@angular/core';
import { CacheService } from '../cache/cache.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StateCacheService {

  private static readonly LastIndexKey = 'state_index';
  private static readonly StateNamesKey = 'state_names';

  constructor( private cache: CacheService ) {
  }

  public getData( key: string ): any {
    return this.cache.load(key, null);
  }

  public saveData( key: string, data: any ): void {
    this.updateCacheRecord(key);
    this.cache.save({
      key,
      data
    });
  }

  private updateCacheRecord( key: string ): void {
    const lastIndex = this.cache.load(StateCacheService.LastIndexKey, -1);
    const names = this.cache.load(StateCacheService.StateNamesKey, []);

    const nextIndex = (lastIndex + 1) % environment.stateCacheLimit;

    if (names[nextIndex]) {
      this.cache.remove(names[nextIndex]);
    }
    names[nextIndex] = key;

    this.cache.save({
      key: StateCacheService.LastIndexKey,
      data: nextIndex
    });
    this.cache.save({
      key: StateCacheService.StateNamesKey,
      data: names
    });
  }
}
