import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCRadioOptionComponent } from './radio-option.component';

describe('TCRadioOptionComponent', () => {
  let component: TCRadioOptionComponent;
  let fixture: ComponentFixture<TCRadioOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCRadioOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCRadioOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
