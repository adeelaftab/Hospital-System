import { Component, EventEmitter, ElementRef, Output, HostBinding } from '@angular/core';

@Component({
  selector: 'tc-dropdown-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class TCDropdownButtonComponent {
  @HostBinding('class.tc-dropdown-link') true;
  @HostBinding('class.active') active: boolean;
  @Output() dropdownState: EventEmitter<boolean>;

  constructor(private element: ElementRef) {
    this.active = false;
    this.dropdownState = new EventEmitter<boolean>();
  }

  // emits event to toggle menu
  toggleDropdown() {
    this.active = !this.active;
    this.dropdownState.emit(this.active);
  }

  // returns button parameters
  getButtonParams(): ClientRect {
    return this.element.nativeElement.getBoundingClientRect();
  }
}
