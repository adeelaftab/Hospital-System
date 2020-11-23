import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCRadioComponent } from './radio.component';

describe('TCRadioComponent', () => {
  let component: TCRadioComponent;
  let fixture: ComponentFixture<TCRadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCRadioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
