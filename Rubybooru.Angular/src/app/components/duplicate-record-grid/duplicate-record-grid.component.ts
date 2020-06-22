import { Component, Input, OnInit } from '@angular/core';
import { ImageApiService } from '../../services/image-api/image-api.service';
import { DuplicateRecord } from '../../entities/duplicate-record';

@Component({
  selector: 'app-duplicate-record-grid',
  templateUrl: './duplicate-record-grid.component.html',
  styleUrls: ['./duplicate-record-grid.component.sass']
})
export class DuplicateRecordGridComponent {

  public readonly TMP_WIDTH = 350;
  public readonly TMP_HEIGHT = 180;

  @Input() records: DuplicateRecord[] = [];

  constructor( public imageApi: ImageApiService ) {
  }

}
