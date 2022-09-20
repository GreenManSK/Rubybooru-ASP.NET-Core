import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusModeButtonComponent } from './focus-mode-button.component';

describe('FocusModeButtonComponent', () => {
  let component: FocusModeButtonComponent;
  let fixture: ComponentFixture<FocusModeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FocusModeButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusModeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
