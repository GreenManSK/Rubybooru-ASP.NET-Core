import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateRecordGridComponent } from './duplicate-record-grid.component';

describe('DuplicateRecordGridComponent', () => {
  let component: DuplicateRecordGridComponent;
  let fixture: ComponentFixture<DuplicateRecordGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateRecordGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateRecordGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
