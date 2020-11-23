import { Component, OnInit, ContentChild, HostBinding, Input, EventEmitter } from '@angular/core';

import { TCDropdownButtonComponent } from './button/button.component';
import { TCDropdownContentComponent } from './content/content.component';

@Component({
  selector: 'tc-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class TCDropdownComponent implements OnInit {
  // get children components
  @ContentChild(TCDropdownButtonComponent) public dropdownButton: TCDropdownButtonComponent;
  @ContentChild(TCDropdownContentComponent) public dropdownContent: TCDropdownContentComponent;

  @HostBinding('class.tc-dropdown') true;
  @HostBinding('class.opened') get getOpened() {
    return this.opened;
  }
  @Input('close') closeEvent: EventEmitter<boolean>;
  opened: boolean;

  constructor() {
    this.opened = false;
    this.closeEvent = new EventEmitter<boolean>();
  }

  ngOnInit() {
    if (this.dropdownButton) {
      this.dropdownButton.dropdownState.subscribe((state) => {
        this.toggleState(state);
      });
    }
    if (this.dropdownContent) {
      this.dropdownContent.closeDropdown.subscribe(() => {
        this.opened = false;
        this.dropdownButton.active = false;
      });
    }
    this.closeEvent.subscribe(event => {
      this.hide();
    });
  }

  // toggles menu visibility
  toggleState(state: boolean) {
    state ? this.show() : this.hide();
  }

  // show dropdown
  show(position = this.dropdownButton.getButtonParams()) {
    this.opened = true;
    // show dropdown content
    this.dropdownContent.show();
    // update dropdown content position based on its button's
    this.dropdownContent.updatePosition(position);
  }

  // hide dropdown
  hide() {
    this.opened = false;
    // hide dropdown content
    this.dropdownContent.hide();
  }
}
