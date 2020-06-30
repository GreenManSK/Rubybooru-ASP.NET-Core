import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private static cleanedOld = false;

  constructor() {
    if (!CacheService.cleanedOld) {
      this.cleanOldKeys();
    }
  }

  private cleanOldKeys() {
    for (const [key, value] of Object.entries(localStorage)) {
      if (this.load(key) == null) {
        this.remove(key);
      }
    }
    CacheService.cleanedOld = true;
  }

  public save( options: LocalStorageSaveOptions ) {
    // Set default values for optionals
    options.expirationMins = options.expirationMins || 0;

    // Set expiration date in miliseconds
    const expirationMS = options.expirationMins !== 0 ? options.expirationMins * 60 * 1000 : 0;

    const record = {
      value: typeof options.data === 'string' ? options.data : JSON.stringify(options.data),
      expiration: expirationMS !== 0 ? new Date().getTime() + expirationMS : null,
      hasExpiration: expirationMS !== 0 ? true : false
    };
    localStorage.setItem(options.key, JSON.stringify(record));
  }

  public load( key: string, defaultValue: any = null ) {
    // Get cached data from localstorage
    const item = localStorage.getItem(key);
    if (item !== null) {
      const record = JSON.parse(item);
      const now = new Date().getTime();
      // Expired data will return null
      if (!record || (record.hasExpiration && record.expiration <= now)) {
        return defaultValue;
      } else {
        return JSON.parse(record.value);
      }
    }
    return defaultValue;
  }

  public remove( key: string ) {
    localStorage.removeItem(key);
  }

  public cleanLocalStorage() {
    localStorage.clear();
  }
}

export class LocalStorageSaveOptions {
  key: string;
  data: any;
  expirationMins?: number;
}
