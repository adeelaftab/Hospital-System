import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCRatingComponent } from './rating.component';

describe('TCRatingComponent', () => {
  let component: TCRatingComponent;
  let fixture: ComponentFixture<TCRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
