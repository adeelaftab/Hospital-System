import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCSelectComponent } from './select.component';

describe('TCSelectComponent', () => {
  let component: TCSelectComponent;
  let fixture: ComponentFixture<TCSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
