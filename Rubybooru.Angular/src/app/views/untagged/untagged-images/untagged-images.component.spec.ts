import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UntaggedImagesComponent } from './untagged-images.component';

describe('UntaggedImagesComponent', () => {
  let component: UntaggedImagesComponent;
  let fixture: ComponentFixture<UntaggedImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UntaggedImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UntaggedImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
