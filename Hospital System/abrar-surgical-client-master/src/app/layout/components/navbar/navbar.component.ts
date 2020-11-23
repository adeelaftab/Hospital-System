import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @HostBinding('class.navbar') true;
  @HostBinding('class.boxed') @Input() boxed: boolean;
  @HostBinding('class.opened') @Input() opened: boolean;
  @HostBinding('class.horizontal') get horizontal() {
    return this.orientation === 'horizontal' || this.orientation === 'horizontal-vertical';
  };
  @HostBinding('class.vertical') get vertical() {
    return this.orientation === 'vertical';
  };
  @HostBinding('class.horizontal-vertical') get horizontalVertical() {
    return this.orientation === 'horizontal-vertical';
  };
  @HostBinding('style.minHeight') get height() {
    return this.minHeight;
  };
  @Input() orientation: string;
  @Input() minHeight: string | number;

  constructor() {
    this.boxed = false;
    this.orientation = 'horizontal';
  }

  ngOnInit() { }
}
