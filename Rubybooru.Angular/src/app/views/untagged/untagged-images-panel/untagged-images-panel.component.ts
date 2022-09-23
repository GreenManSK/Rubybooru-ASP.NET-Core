import { Component, OnInit } from '@angular/core';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageApiService } from '../../../services/image-api/image-api.service';
import { UrlParserService } from '../../../services/url-parser/url-parser.service';
import { TagType } from '../../../entities/tag-type.enum';

@Component({
  selector: 'app-untagged-images-panel',
  templateUrl: './untagged-images-panel.component.html',
  styleUrls: ['./untagged-images-panel.component.sass']
})
export class UntaggedImagesPanelComponent implements OnInit {

  public count = 0;
  public selectedYear?: number = undefined;
  public years: number[] = [];

  private urlParser: UrlParserService;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private imageApi: ImageApiService,
    private sidePanelData: SidePanelDataService
  ) {
    sidePanelData.subscribe(( count ) => {
      this.count = count;
    });
    this.urlParser = new UrlParserService(this.router, this.route);
    this.route.params.subscribe(() => this.onParamChange());
    this.route.queryParams.subscribe(() => this.onParamChange());
  }

  ngOnInit(): void {
    this.imageApi.getWithoutTagTypeYears(TagType.Copyright).subscribe(years => this.years = years);
  }

  private onParamChange() {
    this.selectedYear = this.urlParser.getYear();
  }

  onYearChange() {
    this.router.navigate([], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        year: this.selectedYear
      }
    });
  }
}
