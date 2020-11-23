import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCateogoryFormComponent } from './expense-cateogory-form.component';

describe('ExpenseCateogoryFormComponent', () => {
  let component: ExpenseCateogoryFormComponent;
  let fixture: ComponentFixture<ExpenseCateogoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseCateogoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseCateogoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
