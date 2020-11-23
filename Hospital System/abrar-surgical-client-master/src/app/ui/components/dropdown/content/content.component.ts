import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostBinding,
  HostListener,
  DoCheck,
  Renderer2
} from '@angular/core';

@Component({
  selector: 'tc-dropdown-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class TCDropdownContentComponent implements OnInit, DoCheck {
  @HostBinding('class.tc-dropdown-content') true;
  @HostBinding('class.opened') opened: boolean;
  @HostBinding('class.tc-dropdown-content-inside') @Input() appendToBody: boolean;
  @HostBinding('class.tc-dropdown-global-positioning') @Input() globalPositioning: boolean;
  @Input() overlay: boolean;
  @Input() offset: number[];
  @Input() animation: string;
  @Input() align: string;
  @Input() width: number | string;
  @Input() maxWidth: number | string;
  @Input() maxHeight: number | string;
  @Input() bg: string;
  @Output() closeDropdown: EventEmitter<boolean>;
  position: ClientRect;

  // animation type
  @HostBinding('class.fade-animation') get fade () {
    return this.animation === 'fade' ? true : false;
  }
  @HostBinding('class.fadeInUp-animation') get fadeInUp () {
    return this.animation === 'fadeInUp' ? true : false;
  }
  @HostBinding('class.fadeInDown-animation') get fadeInDown () {
    return this.animation === 'fadeInDown' ? true : false;
  }
  @HostBinding('class.fadeInLeft-animation') get fadeInLeft () {
    return this.animation === 'fadeInLeft' ? true : false;
  }
  @HostBinding('class.fadeInRight-animation') get fadeInRight () {
    return this.animation === 'fadeInRight' ? true : false;
  }
  @HostBinding('class.zoom-animation') get zoom () {
    return this.animation === 'zoom' ? true : false;
  }

  // close from Esc key
  @HostListener('window:keydown', ['$event']) keyboardInput(event: KeyboardEvent) {
    if (this.opened && event.keyCode === 27) {
      this.hide();
    }
  }

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) {
    this.opened = false;
    this.appendToBody = true;
    this.globalPositioning = false;
    this.overlay = true;
    this.animation = 'fade';
    this.align = 'left';
    this.width = 280;
    this.maxWidth = '100%';
    this.maxHeight = 400;
    this.closeDropdown = new EventEmitter<boolean>();
  }

  ngOnInit() {
    // append dropdown content to the body
    if (this.appendToBody || this.globalPositioning) {
      document.body.appendChild(this.element.nativeElement);
    }

    if (typeof this.width === 'number') {
      this.width = this.width + 'px';
    }
  }

  ngDoCheck() {
    if (this.position) {
      const element = this.getContentElement();
      const position = this.calcPositionOffset(this.position);

      if (position) {
        this.renderer.setStyle(element, 'top', `${ position.top }px`);
        this.renderer.setStyle(element, 'left', `${ position.left }px`);
      }
    }
	}
	
	public eventHandler(keycode: number) {
		console.log('button clicked');
	}

  // show dropdown content
  show() {
    this.opened = true;
  }

  // hide dropdown content
  hide() {
    this.opened = false;
    this.closeDropdown.emit(false);
  }

  // get dropdown children elements
  getContentElement(): Element {
    return this.element.nativeElement.children[0];
  }

  // updates the dropdown content position
  updatePosition(position: ClientRect) {
    this.position = position;
  }

  // calculation dropdown position
  calcPositionOffset(position): { top: number, left: number } {
    if (!position) {
      return;
    }

    const element = this.getContentElement();
    const supportPageOffset = window.pageXOffset !== undefined;
    const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
    const x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
    const y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
    const clientWidth = element.clientWidth;
    const clientHeight = element.clientHeight;
    const buttonHeight = position.height;
    const buttonWidth = position.width;

    let { top, left } = this.applyOffset(
      buttonHeight + (this.appendToBody ? (position.top + y) : 0),
      (this.appendToBody) ? position.left + x : 0
    );

    if (this.align === 'right') {
      left -= clientWidth - buttonWidth;
    } else if (this.align === 'center') {
      left -= (clientWidth - buttonWidth) / 2;
    }

    return { top, left };
  }

  // calculation dropdown offset
  applyOffset(top: number, left: number): { top: number, left: number } {
    const offset = this.offset;

    if (
      !offset ||
      !(offset instanceof Array) ||
			(offset instanceof Array && (offset.length === 0) || (typeof offset[0] !== 'number'
				|| !this.appendToBody))
    ) {
      return { top, left };
    }

    top += offset[0];

    if ((typeof offset[1] === 'number') && (offset[1] !== 0)) {
      left += offset[1];
    }

    return { top, left };
  }
}
