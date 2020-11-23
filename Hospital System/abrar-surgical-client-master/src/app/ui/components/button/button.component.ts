import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: '[tc-button]',
  templateUrl: './button.component.html',
  styleUrls: [
    './button.component.scss'
  ]
})
export class TCButtonComponent implements OnInit {
  @HostBinding('class.tc-btn') true;
  @HostBinding('class.btn-block') @Input() block: boolean;
  @HostBinding('class.btn-square') @Input() square: boolean;
  @HostBinding('class.btn-disabled') @Input() disabled: boolean;
  @HostBinding('class.btn-load') @Input() load: boolean;
  @HostBinding('class.btn-outline') @Input() outline: boolean;
  @HostBinding('class.btn-icon-animation') @Input() iconAnimation: boolean;
  @HostBinding('class.btn-left') get alignLeft() { return this.align === 'left' };
  @HostBinding('class.btn-right') get alignRight() { return this.align === 'right' };
  @HostBinding('class.btn-sm') get sizeSm() { return this.size === 'sm' };
  @HostBinding('class.btn-lg') get sizeLg() { return this.size === 'lg' };
  @HostBinding('class.btn-default') get viewDefault() { return this.view === 'default' };
  @HostBinding('class.btn-accent') get viewAccent() { return this.view === 'accent' };
  @HostBinding('class.btn-info') get viewInfo() { return this.view === 'info' };
  @HostBinding('class.btn-success') get viewSuccess() { return this.view === 'success' };
  @HostBinding('class.btn-warning') get viewWarning() { return this.view === 'warning' };
  @HostBinding('class.btn-error') get viewError() { return this.view === 'error' };

  @Input() align: string;
  @Input() size: string;
  @Input() view: string;
  @Input() tcLineStyle: string;
  @Input() beforeIcon: string;
  @Input() afterIcon: string;

  constructor() {
    this.block = false;
    this.disabled = false;
    this.load = false;
    this.outline = false;
    this.align = 'center';
    this.size = 'md';
    this.view = 'default';
    this.iconAnimation = false;
  }

  ngOnInit() { }
}
