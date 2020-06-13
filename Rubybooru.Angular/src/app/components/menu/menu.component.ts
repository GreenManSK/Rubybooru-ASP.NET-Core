import { Component } from '@angular/core';
import { GlobalEventService } from '../../services/global-event/global-event.service';
import { GlobalEventType } from '../../services/global-event/global-event-type';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent {

  constructor( private globalEventService: GlobalEventService ) {
  }

  public toggleAdvancedSearch(): boolean {
    this.globalEventService.send(GlobalEventType.ToggleAdvancedSearch);
    return false;
  }

}
