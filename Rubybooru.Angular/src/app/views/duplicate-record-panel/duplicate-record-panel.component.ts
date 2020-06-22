import { Component } from '@angular/core';
import { DuplicateRecord } from '../../entities/duplicate-record';
import { DuplicateRecordApiService } from '../../services/duplicate-record-api/duplicate-record-api.service';
import { SidePanelDataService } from '../../services/side-panel-data/side-panel-data.service';
import { DuplicateRecordResolution } from '../../data/duplicate-record-resolution';
import { UrlParserService } from '../../services/url-parser/url-parser.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-duplicate-record-panel',
  templateUrl: './duplicate-record-panel.component.html',
  styleUrls: ['./duplicate-record-panel.component.sass']
})
export class DuplicateRecordPanelComponent {

  public DuplicateRecordResolution = DuplicateRecordResolution;

  public record: DuplicateRecord;
  public mergeTags = true;

  private urlParser: UrlParserService;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private duplicateRecordApi: DuplicateRecordApiService,
    private sidePanelData: SidePanelDataService
  ) {
    this.urlParser = new UrlParserService(this.router, this.route);
    sidePanelData.subscribe(data => this.onRecord(data));
  }

  private onRecord( data: DuplicateRecord ): void {
    this.record = data;
  }

  public resolve( resolution: DuplicateRecordResolution ): void {
    this.duplicateRecordApi.resolve(this.record.id, resolution, this.mergeTags).subscribe(() => {
      this.urlParser.navigatePage(1, '/duplicates/');
    });
  }
}
