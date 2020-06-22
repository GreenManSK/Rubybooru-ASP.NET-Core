import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateRecordPanelComponent } from './duplicate-record-panel.component';

describe('DuplicateRecordPanelComponent', () => {
  let component: DuplicateRecordPanelComponent;
  let fixture: ComponentFixture<DuplicateRecordPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateRecordPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateRecordPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
