import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCIconComponent } from './icon.component';

describe('TCIconComponent', () => {
  let component: TCIconComponent;
  let fixture: ComponentFixture<TCIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
