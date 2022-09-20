import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomFilteredImageButtonComponent } from './random-filtered-image-button.component';

describe('RandomFilteredImageButtonComponent', () => {
  let component: RandomFilteredImageButtonComponent;
  let fixture: ComponentFixture<RandomFilteredImageButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomFilteredImageButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomFilteredImageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
