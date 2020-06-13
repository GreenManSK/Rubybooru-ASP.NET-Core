import { EventEmitter, Injectable } from '@angular/core';
import { GlobalEventType } from './global-event-type';

@Injectable({
  providedIn: 'root'
})
export class GlobalEventService {

  private emitter = new EventEmitter<any>();

  constructor() {
  }

  public send( eventType: GlobalEventType ): void {
    this.emitter.emit(eventType);
  }

  public subscribe( listener: any ): void {
    this.emitter.subscribe(listener);
  }
}
