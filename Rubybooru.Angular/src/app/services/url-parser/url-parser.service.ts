import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from '../../entities/tag';
import { SizeCondition } from '../../data/size-condition';

@Injectable({
  providedIn: 'root'
})
export class UrlParserService {

  private static PAGE = 'page';
  private static TAGS = 'tags';
  private static SIZE_CONDITIONS = 'sizeConditions';

  constructor( private router: Router, private route: ActivatedRoute ) {
  }

  getPage(): number {
    const page = +this.route.snapshot.paramMap.get(UrlParserService.PAGE);
    if (!page) {
      return 1;
    }
    return page;
  }

  getTags(): number[] {
    let tags = this.route.snapshot.queryParams[UrlParserService.TAGS];
    if (!tags) {
      return null;
    }
    if (!Array.isArray(tags)) {
      tags = [tags];
    }
    return tags.map(tag => parseInt(tag.replace(/^(\d+)_.*/, '$1'), 10));
  }

  getSizeConditions(): SizeCondition[] {
    const conditions = this.route.snapshot.queryParams[UrlParserService.SIZE_CONDITIONS];
    if (!conditions) {
      return null;
    }
    return JSON.parse(conditions);
  }

  navigate( page: number, tags: Tag[] = null, sizeConditions: SizeCondition[] = null): void {
    this.router.navigate(['/' + page], {
      queryParams: {
        tags: tags.map(tag => tag.id + '_' + tag.name),
        sizeConditions: sizeConditions != null && sizeConditions.length !== 0 ? JSON.stringify(sizeConditions) : null
      }
    });
  }

  navigatePage( page: number, prefix: string = '/' ): void {
    this.router.navigate([prefix + page], {queryParams: this.route.snapshot.queryParams});
  }
}
