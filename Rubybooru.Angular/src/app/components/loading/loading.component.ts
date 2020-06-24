import { Component, Input, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.sass']
})
export class LoadingComponent implements OnInit {

  @Input()
  public show = false;

  public faSpinner = faSpinner;

  constructor() { }

  ngOnInit(): void {
  }

}
