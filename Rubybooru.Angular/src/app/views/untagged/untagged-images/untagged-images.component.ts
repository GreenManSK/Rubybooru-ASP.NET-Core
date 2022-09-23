import { Component, OnInit } from '@angular/core';
import { Image } from '../../../entities/image';
import { UrlParserService } from '../../../services/url-parser/url-parser.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageApiService } from '../../../services/image-api/image-api.service';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';
import { environment } from '../../../../environments/environment';
import { TagType } from '../../../entities/tag-type.enum';

@Component({
  selector: 'app-untagged-images',
  templateUrl: './untagged-images.component.html',
  styleUrls: ['./untagged-images.component.sass']
})
export class UntaggedImagesComponent implements OnInit {

  public images: Image[];
  public page: number;
  public year: number;
  public maxPage: number;
  public loading = false;

  private urlParser: UrlParserService;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private imageApi: ImageApiService,
    private sidePanelData: SidePanelDataService
  ) {
    this.urlParser = new UrlParserService(this.router, this.route);
    this.route.params.subscribe(() => this.onParamChange());
    this.route.queryParams.subscribe(() => this.onParamChange());
  }

  ngOnInit(): void {
    this.updateMaxPageData();
  }

  private onParamChange() {
    const oldPage = this.page;
    this.page = this.urlParser.getPage();

    const oldYear = this.year;
    this.year = this.urlParser.getYear();

    if (this.year !== oldYear) {
      this.updateMaxPageData();
    }

    if (this.page !== oldPage || this.year !== oldYear) {
      this.loading = true;
      this.imageApi.getWithoutTagType(environment.imagesPerPage, environment.imagesPerPage * (this.page - 1), TagType.Copyright, this.year)
        .subscribe(images => {
          this.images = images;
          this.loading = false;
        });
    }
  }

  updateMaxPageData() {
    this.imageApi.getWithoutTagTypeCount(TagType.Copyright, this.urlParser.getYear()).subscribe(count => {
      this.maxPage = Math.ceil(count / environment.imagesPerPage);
      this.sidePanelData.send(count);
    });
  }

  pageChange( page: number ) {
    this.urlParser.navigatePage(page, '/untagged/');
  }


}
