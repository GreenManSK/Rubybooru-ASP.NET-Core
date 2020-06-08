import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from '../../entities/tag';

@Injectable({
  providedIn: 'root'
})
export class UrlParserService {

  private static PAGE = 'page';
  private static TAGS = 'tags';

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

  navigate( page: number, tags: Tag[] = null): void {
    this.router.navigate(['/' + page], {
      queryParams: {
        tags: tags.map(tag => tag.id + '_' + tag.name)
      }
    });
  }

  navigatePage( page: number, prefix: string = '/' ): void {
    this.router.navigate([prefix + page], {queryParams: this.route.snapshot.queryParams});
  }
}
