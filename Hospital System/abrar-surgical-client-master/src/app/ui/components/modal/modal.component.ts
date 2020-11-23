import {
  Component,
  OnInit,
  Input,
  ElementRef,
  EventEmitter,
  HostBinding,
  Renderer2,
  OnDestroy,
  Output
} from '@angular/core';
import { Content, IModalOptions } from '../../interfaces/modal';

@Component({
  selector: 'tc-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class TCModalComponent implements OnInit, OnDestroy {
  @HostBinding('class.tc-modal') true;

  @Input() body: Content<any>;
  @Input() header: Content<any>;
  @Input() footer: Content<any>;
  @Input() opened: boolean;
  @Input() options: IModalOptions;

  @Output() close: EventEmitter<boolean>;

  title: string;
  bodyText: string;
  footerText: string;
  defaultOtions: IModalOptions;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.defaultOtions = {
      height: 'auto',
      width: 500,
      closeButton: false,
      overlay: true,
      overlayClose: true
    };
    this.close = new EventEmitter();
  }

  ngOnInit() {
    this.options = {...this.defaultOtions, ...this.options};

    if (typeof this.options.height === 'number') {
      this.options.height = this.options.height + 'px';
    }

    if (typeof this.options.width === 'number') {
      this.options.width = this.options.width + 'px';
    }

    this.getStringData(this.header, 'title');
    this.getStringData(this.body, 'bodyText');
    this.getStringData(this.footer, 'footerText');

    let elem = this.elementRef.nativeElement;

    setTimeout(() => {
      this.renderer.addClass(elem, this.opened ? 'opened' : 'closed');
    });
  }

  ngOnDestroy() {

  }

  getStringData<T>(data: Content<T>, name: string) {
    this[name] = (typeof data === 'string') ? data : null;
  }

  hideModal() {
    let elem = this.elementRef.nativeElement;
    this.renderer.removeClass(elem,'opened');
  }

  closeWindow(bool: boolean) {
    if (bool) this.close.emit(true);
  }
}
