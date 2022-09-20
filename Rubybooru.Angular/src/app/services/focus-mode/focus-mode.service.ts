import { EventEmitter, Injectable } from '@angular/core';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class FocusModeService {

  private static readonly CacheKey = 'focus_mode';

  private emitter = new EventEmitter<any>();

  constructor(private cacheService: CacheService) { }

  public setValue(isOn: boolean) {
    this.cacheService.save({
      key: FocusModeService.CacheKey,
      data: isOn,
    });
    this.emitter.emit(isOn);
  }

  public getValue() {
    return this.cacheService.load(FocusModeService.CacheKey, false);
  }

  public subscribe( listener: any ) {
    return this.emitter.subscribe(listener);
  }
}
