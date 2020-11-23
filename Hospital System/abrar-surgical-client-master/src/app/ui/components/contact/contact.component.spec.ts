import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCContactComponent } from './contact.component';

describe('TCContactComponent', () => {
  let component: TCContactComponent;
  let fixture: ComponentFixture<TCContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
