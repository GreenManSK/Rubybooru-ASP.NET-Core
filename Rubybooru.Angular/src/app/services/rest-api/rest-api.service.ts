import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClientService } from '../http-client/http-client.service';
import { AlertService } from '../alert/alert.service';
import { AlertType } from '../../data/alert-type';
import { AlertMessage } from '../../data/alert-message';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  protected url: string;

  constructor(public http: HttpClientService, private alertService: AlertService) {
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

      const msg = `${operation} failed: ${error.message}`;
      console.error(msg, error); // log to console
      this.alertService.send(new AlertMessage(msg, AlertType.Error));

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
