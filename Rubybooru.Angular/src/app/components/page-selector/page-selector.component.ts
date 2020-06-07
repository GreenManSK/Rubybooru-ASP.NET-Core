import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.sass']
})
export class PageSelectorComponent implements OnInit {

  @Input() maxPage: number;
  @Input() actualPage: number;
  @Input() size = environment.defaultPaginationSize;
  @Output() pageChange = new EventEmitter<number>();

  public leftIcon = faAngleLeft;
  public rightIcon = faAngleRight;

  constructor() {
  }

  ngOnInit(): void {
  }

  public changePage( page: number ) {
    this.actualPage = page;
    this.pageChange.emit(page);
    return false;
  }

  pageArray(): any[] {
    let result = Array(this.size).fill(1).map(( x, i ) => i + this.actualPage - Math.floor(this.size / 2));
    result = result.filter(v => (v >= 1 && v <= this.maxPage));
    return result;
  }

}
