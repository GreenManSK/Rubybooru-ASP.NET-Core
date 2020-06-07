import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSearchTagsComponent } from './image-search-tags.component';

describe('ImageSearchTagsComponent', () => {
  let component: ImageSearchTagsComponent;
  let fixture: ComponentFixture<ImageSearchTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSearchTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSearchTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
