import { Component, OnInit } from '@angular/core';
import { ImageApiService } from '../../services/image-api/image-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-random-image-button',
  templateUrl: './random-image-button.component.html',
  styleUrls: ['./random-image-button.component.sass']
})
export class RandomImageButtonComponent implements OnInit {

  constructor( private imageApi: ImageApiService, private router: Router ) {
  }

  ngOnInit(): void {
  }

  public onClick(): boolean {
    this.imageApi.randomId().subscribe(id => {
      this.router.navigate(['image', id]);
    });
    return false;
  }

}
