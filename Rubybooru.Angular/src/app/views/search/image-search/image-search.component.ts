import { Component, OnInit } from '@angular/core';
import { Image } from '../../../entities/image';
import { ImageApiService } from '../../../services/image-api/image-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlParserService } from '../../../services/url-parser/url-parser.service';
import { environment } from '../../../../environments/environment';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';
import { SizeCondition } from '../../../data/size-condition';
import { Md5 } from 'ts-md5/dist/md5';
import { StateCacheService } from '../../../services/state-cache/state-cache.service';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.sass']
})
export class ImageSearchComponent implements OnInit {

  public images: Image[];
  public tags: number[];
  public sizeConditions: SizeCondition[];
  public page: number;
  public maxPage: number;
  public count: number;

  public loading = false;

  private urlParser: UrlParserService;

  private stateKey: string;
  private loadedData = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private imageApi: ImageApiService,
    private sidePanelData: SidePanelDataService,
    private stateCache: StateCacheService
  ) {
    this.urlParser = new UrlParserService(this.router, this.route);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.onParamChange(params));
    this.route.queryParams.subscribe(params => this.onParamChange(params));
  }

  private onParamChange( params: object ) {
    let sameTags = true;
    const filterChanged = this.filterChanged();
    this.tags = this.urlParser.getTags();
    this.sizeConditions = this.urlParser.getSizeConditions();
    const newPage = this.urlParser.getPage();

    this.stateKey = this.getStateKey(this.tags, this.sizeConditions, newPage);
    const stateData = this.stateCache.getData(this.stateKey);

    if (stateData != null) {
      this.page = newPage;
      this.loadState(stateData);
      return;
    }

    this.loadedData = 0;
    if (filterChanged) {
      sameTags = false;
      this.imageApi.getCount(this.tags, this.sizeConditions).subscribe(count => this.updateCount(count));
    }

    const oldPage = this.page;
    this.page = newPage;

    if (!sameTags || this.page !== oldPage) {
      this.loading = true;
      this.imageApi.getImages(environment.imagesPerPage, environment.imagesPerPage * (this.page - 1), this.tags, this.sizeConditions)
        .subscribe(images => {
          this.updateImages(images);
          this.saveState();
        });
    }
  }

  private updateCount( count: number ): void {
    this.count = count;
    this.maxPage = Math.ceil(count / environment.imagesPerPage);
  }

  private updateImages( images: Image[] ) {
    this.images = images;
    this.sidePanelData.send(this.images);
    this.loading = false;
    this.loadedData++;
  }

  private saveState(): void {
    const data = {
      count: this.count,
      images: this.images
    };
    this.stateCache.saveData(this.stateKey, data);
  }

  private loadState( data: any ): void {
    this.updateCount(data.count);
    this.updateImages(data.images);
  }

  public pageChange( page: number ) {
    this.urlParser.navigatePage(page);
    const element = document.querySelector('app-image-grid');
    if (element != null) {
      element.scrollIntoView();
    }
  }

  private filterChanged(): boolean {
    return this.serialize(this.urlParser.getTags(), this.urlParser.getSizeConditions()) !== this.serialize(this.tags, this.sizeConditions);
  }

  private serialize( tags: number[], conditions: SizeCondition[] ): string {
    return JSON.stringify(tags) + JSON.stringify(conditions);
  }

  private getStateKey( tags: number[], consitions: SizeCondition[], page: number ): string {
    return Md5.hashStr(this.serialize(tags, consitions) + page) as string;
  }
}
