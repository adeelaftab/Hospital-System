import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCateogryListComponent } from './expense-cateogry-list.component';

describe('ExpenseCateogryListComponent', () => {
  let component: ExpenseCateogryListComponent;
  let fixture: ComponentFixture<ExpenseCateogryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseCateogryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseCateogryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
