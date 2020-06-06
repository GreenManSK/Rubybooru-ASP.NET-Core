import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClientService } from '../http-client/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  protected url: string;

  constructor(public http: HttpClientService) {
    this.url = environment.restUrl;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<T>( operation = 'operation', result?: T ) {
    return ( error: any ): Observable<T> => {

      console.error(`${operation} failed: ${error.message}`, error); // log to console

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
