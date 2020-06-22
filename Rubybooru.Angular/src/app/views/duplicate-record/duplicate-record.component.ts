import { Component, OnInit } from '@angular/core';
import { DuplicateRecord } from '../../entities/duplicate-record';
import { ActivatedRoute } from '@angular/router';
import { ImageApiService } from '../../services/image-api/image-api.service';
import { SidePanelDataService } from '../../services/side-panel-data/side-panel-data.service';
import { DuplicateRecordApiService } from '../../services/duplicate-record-api/duplicate-record-api.service';

@Component({
  selector: 'app-duplicate-record',
  templateUrl: './duplicate-record.component.html',
  styleUrls: ['./duplicate-record.component.sass']
})
export class DuplicateRecordComponent implements OnInit {

  public record: DuplicateRecord;

  constructor(
    private route: ActivatedRoute,
    private duplicateRecordApi: DuplicateRecordApiService,
    public imageApi: ImageApiService,
    private sidePanelData: SidePanelDataService ) {
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.duplicateRecordApi.getRecord(id).subscribe(record => {
      this.record = record;
      this.sidePanelData.send(this.record);
    });
  }

}
