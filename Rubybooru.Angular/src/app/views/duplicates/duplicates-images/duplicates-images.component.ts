import { Component, OnInit } from '@angular/core';
import { UrlParserService } from '../../../services/url-parser/url-parser.service';
import { DuplicateRecord } from '../../../entities/duplicate-record';
import { ActivatedRoute, Router } from '@angular/router';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';
import { DuplicateRecordApiService } from '../../../services/duplicate-record-api/duplicate-record-api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-duplicates-images',
  templateUrl: './duplicates-images.component.html',
  styleUrls: ['./duplicates-images.component.sass']
})
export class DuplicatesImagesComponent implements OnInit {

  public records: DuplicateRecord[];
  public page: number;
  public maxPage: number;
  public loading = false;

  private urlParser: UrlParserService;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private duplicateRecordApi: DuplicateRecordApiService,
    private sidePanelData: SidePanelDataService
  ) {
    this.urlParser = new UrlParserService(this.router, this.route);
    this.route.params.subscribe(() => this.onParamChange());
    this.route.queryParams.subscribe(() => this.onParamChange());
  }

  ngOnInit(): void {
    this.duplicateRecordApi.getRecordsCount().subscribe(count => {
      this.maxPage = Math.ceil(count / environment.imagesPerPage);
      this.sidePanelData.send(count);
    });
  }

  private onParamChange(): void {
    const oldPage = this.page;
    this.page = this.urlParser.getPage();

    if (this.page !== oldPage) {
      this.loading = true;
      this.duplicateRecordApi.getRecords(environment.imagesPerPage, environment.imagesPerPage * (this.page - 1))
        .subscribe(records => {
          this.records = records;
          this.loading = false;
        });
    }
  }

  public pageChange( page: number ): void {
    this.urlParser.navigatePage(page, '/duplicates/');
  }

}
