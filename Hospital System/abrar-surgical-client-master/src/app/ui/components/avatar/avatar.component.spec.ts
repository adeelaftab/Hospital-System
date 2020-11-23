import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCAvatarComponent } from './avatar.component';

describe('TCAvatarComponent', () => {
  let component: TCAvatarComponent;
  let fixture: ComponentFixture<TCAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
