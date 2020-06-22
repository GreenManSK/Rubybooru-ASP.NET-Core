import { EventEmitter, Injectable } from '@angular/core';
import { AlertMessage } from '../../data/alert-message';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private emitter = new EventEmitter<any>();

  constructor() { }

  public send( alert: AlertMessage ): void {
    this.emitter.emit(alert);
  }

  public subscribe( listener: any ): void {
    this.emitter.subscribe(listener);
  }
}
