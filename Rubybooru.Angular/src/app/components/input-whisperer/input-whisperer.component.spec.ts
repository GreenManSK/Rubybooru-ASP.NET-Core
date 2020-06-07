import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWhispererComponent } from './input-whisperer.component';

describe('InputWhispererComponent', () => {
  let component: InputWhispererComponent;
  let fixture: ComponentFixture<InputWhispererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputWhispererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWhispererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
