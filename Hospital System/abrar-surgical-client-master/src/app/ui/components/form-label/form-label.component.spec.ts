import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCFormLabelComponent } from './form-label.component';

describe('TCFormLabelComponent', () => {
  let component: TCFormLabelComponent;
  let fixture: ComponentFixture<TCFormLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCFormLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCFormLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
