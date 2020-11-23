import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCBadgeComponent } from './badge.component';

describe('TCBadgeComponent', () => {
  let component: TCBadgeComponent;
  let fixture: ComponentFixture<TCBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
