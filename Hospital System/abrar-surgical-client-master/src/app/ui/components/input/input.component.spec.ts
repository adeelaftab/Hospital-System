import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCInputComponent } from './input.component';

describe('TCInputComponent', () => {
  let component: TCInputComponent;
  let fixture: ComponentFixture<TCInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
