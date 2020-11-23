import { Directive, HostBinding, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[tcBorderColor]'
})
export class TCBorderColorDirective implements OnInit {
  @HostBinding('class.custom-border-color') true;
  @Input() tcBorderColor: string | string[];
  currentColor: string;
  defaultColor: string;
  hoveredColor: string;

  ngOnInit() {
    const COLOR = this.tcBorderColor;

    this.defaultColor = (typeof COLOR === 'string') ? COLOR: COLOR[0];
    this.hoveredColor = (typeof COLOR === 'string') ? COLOR: COLOR[1];
    this.currentColor = this.defaultColor;
  }

  @HostBinding('style.borderColor') get getStyle() {
    return this.currentColor;
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.currentColor = this.hoveredColor;
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.currentColor = this.defaultColor;
  }
}
