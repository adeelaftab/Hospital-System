import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCAutocompleteComponent } from './autocomplete.component';

describe('TCAutocompleteComponent', () => {
  let component: TCAutocompleteComponent;
  let fixture: ComponentFixture<TCAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
