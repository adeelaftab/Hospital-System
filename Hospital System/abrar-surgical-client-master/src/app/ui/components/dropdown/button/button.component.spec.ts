import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCDropdownButtonComponent } from './button.component';

describe('TCDropdownButtonComponent', () => {
  let component: TCDropdownButtonComponent;
  let fixture: ComponentFixture<TCDropdownButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCDropdownButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCDropdownButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
