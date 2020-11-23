import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCDropdownComponent } from './dropdown.component';

describe('TCDropdownComponent', () => {
  let component: TCDropdownComponent;
  let fixture: ComponentFixture<TCDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
