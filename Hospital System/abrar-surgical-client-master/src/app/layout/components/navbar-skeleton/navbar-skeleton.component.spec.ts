import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSkeletonComponent } from './navbar-skeleton.component';

describe('NavbarSkeletonComponent', () => {
  let component: NavbarSkeletonComponent;
  let fixture: ComponentFixture<NavbarSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
