import {
  AfterContentInit, ChangeDetectorRef,
  Component, ContentChildren, EventEmitter, forwardRef, HostBinding, Input, Output,
  QueryList
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TCRadioOptionComponent } from './radio-option/radio-option.component';

@Component({
  selector: 'tc-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TCRadioComponent),
      multi: true
    }
  ]
})
export class TCRadioComponent implements AfterContentInit, ControlValueAccessor {
  @Input() direction: string;
  @Input() value: string;
  @Output() change: EventEmitter<string>;
  @HostBinding('class.tc-radio') true;
  @HostBinding('class.tc-radio-horizontal') get getDirection() {
    return this.direction === 'horizontal';
  }

  // get option component
  @ContentChildren(TCRadioOptionComponent) radioOptions: QueryList<TCRadioOptionComponent>;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    private cdRef: ChangeDetectorRef
  ) {
    this.change = new EventEmitter<string>();
  }

  ngAfterContentInit() {
    this.setCheckedOption(this.value, true);
    this.cdRef.detectChanges();
  }

  setCheckedOption(value: string, subscribe: boolean) {
    if (this.radioOptions && this.radioOptions.length) {
      this.radioOptions.forEach(option => {
        option.checked = (option._value === value) ? true : false;

        if (subscribe) {
          option.changeValue.subscribe((newValue) => {
            this.writeValue(newValue);
            this.change.emit(newValue);
            this.onChange(newValue);

            this.radioOptions.forEach(option => {
              option.checked = (option._value === newValue) ? true : false;
              option.changeAttr(option._value === newValue);
            });
          });
        }
      });
    }
  }

  writeValue(value) {
    if (!value || typeof value !== 'string') {
      return;
    }
    this.value = value;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }
}
