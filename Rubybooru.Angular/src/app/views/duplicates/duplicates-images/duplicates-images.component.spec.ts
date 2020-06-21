import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicatesImagesComponent } from './duplicates-images.component';

describe('DuplicatesImagesComponent', () => {
  let component: DuplicatesImagesComponent;
  let fixture: ComponentFixture<DuplicatesImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicatesImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicatesImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
