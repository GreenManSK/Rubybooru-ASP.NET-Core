import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeConditionComponent } from './size-condition.component';

describe('SizeConditionComponent', () => {
  let component: SizeConditionComponent;
  let fixture: ComponentFixture<SizeConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizeConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
