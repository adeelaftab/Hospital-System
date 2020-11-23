import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCVTimelineComponent } from './v-timeline.component';

describe('TCVTimelineComponent', () => {
  let component: TCVTimelineComponent;
  let fixture: ComponentFixture<TCVTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCVTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCVTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
