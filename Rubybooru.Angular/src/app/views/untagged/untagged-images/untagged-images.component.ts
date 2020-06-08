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
  public maxPage: number;

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
    this.imageApi.getWithoutTagTypeCount(TagType.Copyright).subscribe(count => {
      this.maxPage = Math.ceil(count / environment.imagesPerPage);
      this.sidePanelData.send(count);
    });
  }

  private onParamChange() {
    const oldPage = this.page;
    this.page = this.urlParser.getPage();

    if (this.page !== oldPage) {
      this.imageApi.getWithoutTagType(environment.imagesPerPage, environment.imagesPerPage * (this.page - 1), TagType.Copyright)
        .subscribe(images => {
          this.images = images;
        });
    }
  }

  pageChange( page: number ) {
    this.urlParser.navigatePage(page, '/untagged/');
  }


}
