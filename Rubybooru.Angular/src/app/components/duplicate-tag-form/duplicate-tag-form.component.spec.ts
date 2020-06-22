import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateTagFormComponent } from './duplicate-tag-form.component';

describe('DuplicateTagFormComponent', () => {
  let component: DuplicateTagFormComponent;
  let fixture: ComponentFixture<DuplicateTagFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateTagFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateTagFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
