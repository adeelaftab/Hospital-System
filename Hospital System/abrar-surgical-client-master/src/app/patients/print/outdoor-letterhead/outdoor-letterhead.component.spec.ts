import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutdoorLetterheadComponent } from './outdoor-letterhead.component';

describe('OutdoorLetterheadComponent', () => {
  let component: OutdoorLetterheadComponent;
  let fixture: ComponentFixture<OutdoorLetterheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutdoorLetterheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutdoorLetterheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
