import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TPModalComponent } from './modal.component';

describe('TPModalComponent', () => {
  let component: TPModalComponent;
  let fixture: ComponentFixture<TPModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TPModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TPModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
