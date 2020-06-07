import { Component, OnInit } from '@angular/core';
import { Image } from '../../../entities/image';
import { ImageApiService } from '../../../services/image-api/image-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlParserService } from '../../../services/url-parser/url-parser.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.sass']
})
export class ImageSearchComponent implements OnInit {

  public images: Image[];
  public tags: number[];
  public page: number;
  public maxPage: number;

  private urlParser: UrlParserService;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private imageApi: ImageApiService
  ) {
    this.urlParser = new UrlParserService(this.router, this.route);
    this.route.params.subscribe(params => this.onParamChange(params));
    this.route.queryParams.subscribe(params => this.onParamChange(params));
  }

  ngOnInit(): void {
  }

  private onParamChange(params: object) {
    let sameTags = true;
    if (this.filterChanged()) {
      sameTags = false;
      this.imageApi.getCount(this.tags).subscribe(count => {
        this.maxPage = Math.ceil(count / environment.imagesPerPage);
      });
    }

    const oldPage = this.page;
    this.page = this.urlParser.getPage();
    this.tags = this.urlParser.getTags();

    if (!sameTags || this.page !== oldPage) {
      this.imageApi.getImages(environment.imagesPerPage, environment.imagesPerPage * (this.page - 1), this.tags).subscribe(images => {
        this.images = images;
      });
    }
  }

  pageChange( page: number ) {
    this.urlParser.navigatePage(page);
  }

  filterChanged(): boolean {
    return JSON.stringify(this.urlParser.getTags()) !== JSON.stringify(this.tags);
  }
}
