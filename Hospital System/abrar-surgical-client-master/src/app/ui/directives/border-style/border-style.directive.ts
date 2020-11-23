import { Directive, HostBinding, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[tcBorderStyle]'
})
export class TCBorderStyleDirective implements OnInit {
  @HostBinding('class.custom-border-style') true;
  @Input() tcBorderStyle: string | string[];
  currentStyle: string;
  defaultStyle: string;
  hoveredStyle: string;

  ngOnInit() {
    const STYLE = this.tcBorderStyle;

    this.defaultStyle = (typeof STYLE === 'string') ? STYLE: STYLE[0];
    this.hoveredStyle = (typeof STYLE === 'string') ? STYLE: STYLE[1];
    this.currentStyle = this.defaultStyle;
  }

  @HostBinding('style.borderStyle') get getStyle() {
    return this.currentStyle;
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.currentStyle = this.hoveredStyle;
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.currentStyle = this.defaultStyle;
  }
}
