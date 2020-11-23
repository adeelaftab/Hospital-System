import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCSwitcherComponent } from './switcher.component';

describe('TCSwitcherComponent', () => {
  let component: TCSwitcherComponent;
  let fixture: ComponentFixture<TCSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCSwitcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
