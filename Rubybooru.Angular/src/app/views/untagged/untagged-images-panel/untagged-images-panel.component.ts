import { Component } from '@angular/core';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';

@Component({
  selector: 'app-untagged-images-panel',
  templateUrl: './untagged-images-panel.component.html',
  styleUrls: ['./untagged-images-panel.component.sass']
})
export class UntaggedImagesPanelComponent {

  public count = 0;

  constructor( private sidePanelData: SidePanelDataService ) {
    sidePanelData.subscribe(( count ) => {
      this.count = count;
    });
  }

}
