import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../cache/cache.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export enum Verbs {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE'
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private http: HttpClient,
    private cacheService: CacheService,
  ) {
  }

  get<T>( options: HttpOptions ): Observable<T> {
    return this.httpCall(Verbs.GET, options);
  }

  delete<T>( options: HttpOptions ): Observable<T> {
    return this.httpCall(Verbs.DELETE, options);
  }

  post<T>( options: HttpOptions ): Observable<T> {
    return this.httpCall(Verbs.POST, options);
  }

  put<T>( options: HttpOptions ): Observable<T> {
    return this.httpCall(Verbs.PUT, options);
  }

  private httpCall<T>( verb: Verbs, options: HttpOptions ): Observable<T> {

    // Setup default values
    options.body = options.body || null;
    options.cacheMins = options.cacheMins || 0;

    if (options.cacheMins > 0) {
      // Get data from cache
      const data = this.cacheService.load(options.url);
      // Return data from cache
      if (data !== null) {
        return of<T>(data);
      }
    }

    return this.http.request<T>(verb, options.url, {
      body: options.body
    })
      .pipe(
        switchMap(response => {
          if (options.cacheMins > 0) {
            // Data will be cached
            this.cacheService.save({
              key: options.url,
              data: response,
              expirationMins: options.cacheMins
            });
          }
          return of<T>(response);
        })
      );
  }
}

export class HttpOptions {
  url: string;
  body?: any;
  cacheMins?: number;
}
