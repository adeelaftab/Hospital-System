import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCDropdownContentComponent } from './content.component';

describe('TCDropdownContentComponent', () => {
  let component: TCDropdownContentComponent;
  let fixture: ComponentFixture<TCDropdownContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCDropdownContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCDropdownContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
