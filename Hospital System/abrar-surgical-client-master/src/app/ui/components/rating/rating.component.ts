import { Component, OnInit, HostBinding, Input, forwardRef, Renderer2, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tc-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TCRatingComponent),
      multi: true
    }
  ]
})
export class TCRatingComponent implements OnInit, ControlValueAccessor {
  @HostBinding('class.tc-rating')	true;
  @HostBinding('class.rating-disabled')	@Input() disabled: boolean;
  @HostBinding('class.rating-numbered')	get numbered() {
    return this.view === 'number';
  };

  @Input() iconsNumber: number;
  @Input() iconClass: string;
  @Input() view: string;
  @Input() color: string[];
  @Input('value') innerValue: number;

  icons: number[];

  private onChange: any = (value: number) => { };
  private onTouched: any = () => { };

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) {
    this.color = [];
    this.disabled = false;
    this.innerValue = 0;
    this.iconsNumber = 5;
    this.iconClass = 'icofont-star';
  }

  ngOnInit() {
    this.icons = Array.from(new Array(this.iconsNumber), (val, index) => index + 1);
    this.value = this.innerValue <= this.iconsNumber ? this.innerValue : 0;
  }

  // set value
  set value(value: number) {
    if (value >= 0 && value <= this.iconsNumber && value !== this.innerValue) {
      this.innerValue = value;
      this.writeValue(value);
      this.onChange(value);
    }
  }

  // get value
  get value() {
    return this.innerValue;
  }

  // write value
  writeValue(value: number): void {
    this.innerValue = value;
  }

  // register OnChange event
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // register OnTouched event
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // set value
  setValue(val: number, disabled: boolean) {
    !disabled ? this.value = val : null;
  }

  // add class 'hover'
  addHover(i: number, val: number, disabled: boolean = this.disabled) {
    if (!disabled) {
      this.icons.forEach((icon, index) => {
        const ITEM_REF: any = this.element.nativeElement.children[index];
        const COLOR: string = (index < val) ? this.color[2] : (i > index ? this.color[1] : this.color[0]);

        this.renderer.setStyle(ITEM_REF, 'color', COLOR);

        if (i > index) {
          this.renderer.addClass(ITEM_REF, 'hover');
        } else {
          this.renderer.removeClass(ITEM_REF, 'hover');
        }
      });
    }
  }

  // remove class 'hover'
  removeHover(val: number, disabled: boolean = this.disabled) {
    if (!disabled) {
      this.icons.forEach((icon, index) => {
        const ITEM_REF: any = this.element.nativeElement.children[index];

        this.renderer.setStyle(ITEM_REF, 'color', index < val ? this.color[2] : this.color[0]);
        this.renderer.removeClass(ITEM_REF, 'hover');
      });
    }
  }

  // get icon color
  getIconStyles(active: boolean) {
    return {
      'color': this.color.length ? (active ? this.color[2] : this.color[0]) : null
    }
  }
}
