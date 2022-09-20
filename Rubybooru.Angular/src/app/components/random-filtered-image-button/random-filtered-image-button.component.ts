import { Component, OnInit } from '@angular/core';
import { ImageApiService } from '../../services/image-api/image-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlParserService } from '../../services/url-parser/url-parser.service';

@Component({
  selector: 'app-random-filtered-image-button',
  templateUrl: './random-filtered-image-button.component.html',
  styleUrls: ['./random-filtered-image-button.component.sass']
})
export class RandomFilteredImageButtonComponent implements OnInit {

  public shouldShow = true;

  private urlParser: UrlParserService;

  constructor( private imageApi: ImageApiService, private router: Router, private route: ActivatedRoute ) {
    this.urlParser = new UrlParserService(this.router, this.route);
  }

  ngOnInit(): void {
    this.route.params.subscribe(() => this.onParamChange());
    this.route.queryParams.subscribe(() => this.onParamChange());
  }

  private onParamChange() {
    const tags = this.urlParser.getTags();
    const hasTags = tags !== null && tags.length > 0;
    const sizeConditions = this.urlParser.getSizeConditions();
    const hasSizeConditions = sizeConditions !== null && sizeConditions.length > 0;
    this.shouldShow = hasTags || hasSizeConditions;
  }

  public onClick(): boolean {
    this.imageApi.randomFilteredId(this.urlParser.getTags(), this.urlParser.getSizeConditions()).subscribe(id => {
      this.router.navigate(['image', id], {queryParams: this.route.snapshot.queryParams});
    });
    return false;
  }

}
