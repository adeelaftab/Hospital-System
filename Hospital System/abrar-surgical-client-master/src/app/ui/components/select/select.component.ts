import {
  Component, OnInit, HostBinding, Input, ElementRef, HostListener, forwardRef, Output, EventEmitter,
  Renderer2, ContentChild, TemplateRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

import { IOption } from '../../interfaces/option';
import { selectState } from '../../interfaces/general';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'tc-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [
    trigger('shrink', [
      state('active',style({
        height: '*',
        opacity: 1,
        visibility: 'visible'
      })),
      state('inactive',style({
        height: 0,
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('inactive => active', animate('200ms ease-in-out')),
      transition('active => inactive', animate('200ms ease-in'))
    ])
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TCSelectComponent),
      multi: true
    }
  ]
})
export class TCSelectComponent implements OnInit, ControlValueAccessor {
  @HostBinding('class.tc-select') true;
  @HostBinding('class.opened') @Input() opened: boolean;
  @HostBinding('class.disabled') @Input() disabled: boolean;
  @HostBinding('class.multiple') @Input() multiple: boolean;
  @HostBinding('class.selected') @Input() selected: string | string[];
  @HostBinding('class.select-sm') get smSize() {
    return this.size === 'sm';
  }
  @HostBinding('class.select-lg') get lgSize() {
    return this.size === 'lg';
  }

  @Input() borderColor: string | string[];
  @Input() bgColor: string | string[];
  @Input() color: string | string[];
  @Input() listBgColor: string;
  @Input() listBorderColor: string;
  @Input() listColor: string;
  @Input() listHighlightBgColor: string;
  @Input() listHighlightTextColor: string;
  @Input() options: IOption[];
  @Input() allowClear: boolean;
  @Input() filter: boolean;
  @Input() placeholder: string;
  @Input() notFoundMsg: string;
  @Input() size: string;

  @Output() valueSelected: EventEmitter<any | any[]>;

  @ContentChild('optionTemplate') optionTpl: TemplateRef<any>;

  innerValue: string | string[];
  selectedOptions: IOption[];
  selectState: any;
  filterForm: FormControl;
  currentBgColor: string;
  currentColor: string;
  currentBorderColor: string;

  onChange = (value: string | string[]) => {};
  onTouched = () => {};

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.multiple = false;
    this.selectState = selectState;
    this.selectedOptions = [];
    this.options = [];
    this.allowClear = false;
    this.disabled = false;
    this.filter = false;
    this.filterForm = new FormControl('');
    this.notFoundMsg = 'No results found!';
    this.opened = false;
    this.valueSelected = new EventEmitter();
    this.size = 'md';
  }

  ngOnInit() {
    this.currentBgColor = this.bgColor instanceof Array ? this.bgColor[0] : this.bgColor;
    this.currentBorderColor = this.borderColor instanceof Array ? this.borderColor[0] : this.borderColor;
    this.currentColor = this.color instanceof Array ? this.color[0] : this.color;

    this.setStyles(!this.disabled ? this.selectState.default : this.selectState.disabled);

    this.selected ? this.writeValue(this.selected) : null;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.opened) {
      this.setStyles(this.selectState.hover);
    }
  }

  @HostListener('mouseleave')
  onMouseOut() {
    if (!this.opened) {
      this.setStyles(this.selectState.default);
    }
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    if (this.opened && !this.elementRef.nativeElement.contains(event.target)) {
      this.setStyles(this.selectState.default);
      this.opened = false;
      this.onTouched();
    }
  }

  // write value
  writeValue(value: string | string[], options: IOption[] = this.options) {
    if (options && options.length) {
      let val: any;

      if (this.multiple) {
        val = [];

        options.forEach(opt => {
          (Array.isArray(value) ? value.includes(opt.value) : opt.value == value) ? val.push(opt.value) : null;
        });
      } else {
        let selectedOpt: IOption;

        selectedOpt = options.find(opt => {
          return (Array.isArray(value)) ? value.includes(opt.value) : opt.value === value;
        });

        val = selectedOpt ? selectedOpt.value : null;
      }

      this.setSelectedOptions(val);
      this.innerValue = val;
      this.onChange(val);
    }
  }

  // register OnChange event
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  // register OnTouched event
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  // get all options
  getOptions(options: IOption[]): IOption[] {
    return options.filter((option: IOption) => {
      return option.label.toString().toLowerCase().startsWith(this.filterForm.value.toString().toLowerCase());
    });
  }

  // set selected option
  setSelectedOptions(value: string | string[]) {
    if (this.options && this.options.length) {
      this.selectedOptions = this.options.filter(option => {
        return !this.multiple ? (option.value === value) : (this.includeSelected(value, option.value));
      });
    }
  }

  // detect include in selected options
  includeSelected(selected: string | string[], value: string) {
    return Array.isArray(selected) && selected.length && selected.includes(value);
  }

  // clear selected options
  clearOptions(event: Event) {
    event.stopPropagation();

    this.innerValue = this.selected = null;
    this.writeValue(this.innerValue);
  }

  // detect selected option
  isSelected(value: string) {
    let bool: boolean = false;

    if (this.multiple) {
      bool = (this.includeSelected(this.innerValue, value)) ? true : false;
    } else {
      bool = (this.innerValue && this.innerValue === value) ? true : false;
    }

    return bool;
  }

  // remove option from selected
  removeSelectedOption(event: Event, option: IOption) {
    event.stopPropagation();

    if (Array.isArray(this.innerValue)) {
      this.innerValue = this.innerValue.filter(opt => opt !== option.value);

      this.writeValue(this.innerValue);
    }
  }

  // select option
  selectOption(opt: IOption, active: boolean) {
    if (this.multiple) {
      !this.innerValue ? this.innerValue = [] : null;

      Array.isArray(this.innerValue) ? this.writeValue([...this.innerValue, opt.value]) : null;
    } else {
      if (!active) {
        this.writeValue(opt.value);
        this.setStyles(this.selectState.default);

        this.opened = false;
      }
    }
  }

  // toggle (opened/closed) list state
  toggleState(state: boolean) {
    this.opened = !state;

    !this.opened ? this.onTouched() : null;
    this.setStyles(!state ? this.selectState.opened : this.selectState.default);
  }

  // get value
  get value() {
    return this.innerValue;
  }

  // set value
  set value(value: string | string[]) {
    this.value = value;
    this.writeValue(value);
    this.onChange(value);
  }

  // custom component's styles
  getSelectStyles() {
    return {
      'color': this.currentColor,
      'background': this.currentBgColor,
      'border-color': this.currentBorderColor
    };
  }

  getListStyles() {
    return {
      'color': this.listColor ? this.listColor : null,
      'background': this.listBgColor ? this.listBgColor : null,
      'border-color': this.listBorderColor ? this.listBorderColor : null
    };
  }

  getOptionStyle(selected: boolean) {
    if (selected) {
      return {
        'color': this.listHighlightTextColor ?  this.listHighlightTextColor : null,
        'background': this.listHighlightBgColor ? this.listHighlightBgColor : null
      };
    }
  }

  optionMouseenter(event: Event) {
    this.listHighlightTextColor ? this.renderer.setStyle(event.target, 'color', this.listHighlightTextColor) : null;
    this.listHighlightBgColor ? this.renderer.setStyle(event.target, 'background', this.listHighlightBgColor) : null;
  }

  optionMouseleave(event: Event, selected: boolean) {
    if (!selected) {
      this.renderer.removeStyle(event.target, 'color');
      this.renderer.removeStyle(event.target, 'background');
    }
  }

  setStyles(
    st: selectState,
    bg: string | string[] = this.bgColor,
    border: string | string[] = this.borderColor,
    color: string | string[] = this.color
  ) {
    let styleIndex : number = 0;

    switch (st) {
      case this.selectState.hover:
        styleIndex = 1;
        break;
      case this.selectState.opened:
        styleIndex = 2;
        break;
      case this.selectState.disabled:
        styleIndex = 3;
        break;
      default:
        styleIndex = 0;
    }

    this.currentBgColor = bg instanceof Array ? bg[styleIndex] : bg;
    this.currentBorderColor = border instanceof Array ? border[styleIndex] : border;
    this.currentColor = color instanceof Array ? color[styleIndex] : color;
  }
}
