import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageApiService } from '../../../services/image-api/image-api.service';
import { Image } from '../../../entities/image';
import { SidePanelDataService } from '../../../services/side-panel-data/side-panel-data.service';
import { Title } from '@angular/platform-browser';
import { FocusModeService } from '../../../services/focus-mode/focus-mode.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.sass']
})
export class ImageComponent implements OnInit, OnDestroy {

  public image: Image;
  public isMini = true;
  public isFullscreen = false;
  public isFocusMode = false;
  private focusModeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    public imageApi: ImageApiService,
    private sidePanelData: SidePanelDataService,
    private titleService: Title,
    private focusModeService: FocusModeService
  ) {
  }

  ngOnInit(): void {
    this.getImage();
    this.onResize();
    this.route.params.subscribe(() => this.getImage());
    this.isFocusMode = this.focusModeService.getValue();
    this.focusModeSubscription = this.focusModeService.subscribe(isOn => this.isFocusMode = isOn);
  }

  ngOnDestroy(): void {
    this.titleService.setTitle('Rubybooru');
    this.focusModeSubscription?.unsubscribe();
  }

  public toggleMini(): void {
    this.isMini = !this.isMini;
  }

  private getImage(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.imageApi.getImage(id).subscribe(image => {
      this.image = image;
      this.sidePanelData.send(this.image);
      this.titleService.setTitle(image.name);
    });
  }

  @HostListener('window:resize', ['$event'])
  public onResize(): void {
    this.isFullscreen = screen.height === window.innerHeight;
  }
}
