import { Component } from '@angular/core';
import { Image } from '../../../entities/image';
import { ImageApiService } from '../../../services/image-api/image-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlParserService } from '../../../services/url-parser/url-parser.service';
import { environment } from '../../../../environments/environment';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';
import { SizeCondition } from '../../../data/size-condition';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.sass']
})
export class ImageSearchComponent {

  public images: Image[];
  public tags: number[];
  public sizeConditions: SizeCondition[];
  public page: number;
  public maxPage: number;
  public count: number;

  public loading = false;

  private urlParser: UrlParserService;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private imageApi: ImageApiService,
    private sidePanelData: SidePanelDataService
  ) {
    this.urlParser = new UrlParserService(this.router, this.route);
    this.route.params.subscribe(params => this.onParamChange(params));
    this.route.queryParams.subscribe(params => this.onParamChange(params));
  }

  private onParamChange( params: object ) {
    let sameTags = true;
    const filterChanged = this.filterChanged();
    this.tags = this.urlParser.getTags();
    this.sizeConditions = this.urlParser.getSizeConditions();
    if (filterChanged) {
      sameTags = false;
      this.imageApi.getCount(this.tags, this.sizeConditions).subscribe(count => {
        this.count = count;
        this.maxPage = Math.ceil(count / environment.imagesPerPage);
      });
    }

    const oldPage = this.page;
    this.page = this.urlParser.getPage();

    if (!sameTags || this.page !== oldPage) {
      this.loading = true;
      this.imageApi.getImages(environment.imagesPerPage, environment.imagesPerPage * (this.page - 1), this.tags, this.sizeConditions)
        .subscribe(images => {
          this.images = images;
          this.sidePanelData.send(this.images);
          this.loading = false;
        });
    }
  }

  public pageChange( page: number ) {
    this.urlParser.navigatePage(page);
  }

  private filterChanged(): boolean {
    return this.serialize(this.urlParser.getTags(), this.urlParser.getSizeConditions()) !== this.serialize(this.tags, this.sizeConditions);
  }

  private serialize( tags: number[], conditions: SizeCondition[] ) {
    return JSON.stringify(tags) + JSON.stringify(conditions);
  }
}
