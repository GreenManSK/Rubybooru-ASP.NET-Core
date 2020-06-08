import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UntaggedImagesPanelComponent } from './untagged-images-panel.component';

describe('UntaggedImagesPanelComponent', () => {
  let component: UntaggedImagesPanelComponent;
  let fixture: ComponentFixture<UntaggedImagesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UntaggedImagesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UntaggedImagesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
