import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshCatcheButtonComponent } from './refresh-catche-button.component';

describe('RefreshCatcheButtonComponent', () => {
  let component: RefreshCatcheButtonComponent;
  let fixture: ComponentFixture<RefreshCatcheButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefreshCatcheButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshCatcheButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
