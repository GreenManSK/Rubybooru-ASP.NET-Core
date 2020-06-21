import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicatesPanelComponent } from './duplicates-panel.component';

describe('DuplicatesPanelComponent', () => {
  let component: DuplicatesPanelComponent;
  let fixture: ComponentFixture<DuplicatesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicatesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicatesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
