import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSignInComponent } from './sign-in.component';

describe('PageSignInComponent', () => {
  let component: PageSignInComponent;
  let fixture: ComponentFixture<PageSignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSignInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
