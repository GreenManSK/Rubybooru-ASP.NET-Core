import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateRecordComponent } from './duplicate-record.component';

describe('DuplicateRecordComponent', () => {
  let component: DuplicateRecordComponent;
  let fixture: ComponentFixture<DuplicateRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
