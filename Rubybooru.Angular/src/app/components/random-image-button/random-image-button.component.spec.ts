import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomImageButtonComponent } from './random-image-button.component';

describe('RandomImageButtonComponent', () => {
  let component: RandomImageButtonComponent;
  let fixture: ComponentFixture<RandomImageButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomImageButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomImageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
