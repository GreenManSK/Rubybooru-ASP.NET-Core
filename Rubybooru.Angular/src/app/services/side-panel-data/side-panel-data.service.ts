import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidePanelDataService {

  private emitter = new EventEmitter<any>();

  constructor() {
  }

  public send( data: any ): void {
    this.emitter.emit(data);
  }

  public subscribe(listener: any): void {
    this.emitter.subscribe(listener);
  }

  public unsubscribe(): void {
    this.emitter.unsubscribe();
  }
}
