import { Component, OnInit } from '@angular/core';
import { FocusModeService } from '../../services/focus-mode/focus-mode.service';
import { NavigationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-focus-mode-button',
  templateUrl: './focus-mode-button.component.html',
  styleUrls: ['./focus-mode-button.component.sass']
})
export class FocusModeButtonComponent implements OnInit {

  public isOn = false;
  public isImage = false;

  constructor(
    private focusModeService: FocusModeService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.isOn = this.focusModeService.getValue();
    this.focusModeService.subscribe(isOn => this.isOn = isOn);
    // this.route.url.subscribe(params => console.log(params));
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        map(event => event as NavigationStart),  // appease typescript
      )
      .subscribe(
        event => this.isImage = event.url.startsWith('/image/')
      );
  }

  onChange(): void {
    this.focusModeService.setValue(this.isOn);
  }
}
