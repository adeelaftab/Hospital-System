import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'navbar-skeleton',
  templateUrl: './navbar-skeleton.component.html',
  styleUrls: ['./navbar-skeleton.component.scss']
})
export class NavbarSkeletonComponent implements OnInit {
  @Input() type: string;

  @HostBinding('class.navbar-skeleton') true;
  @HostBinding('class.anvisible') @Input() loaded: boolean;
  @HostBinding('class.horizontal') get horizontal() {
    return this.type === 'horizontal';
  };
  @HostBinding('class.vertical') get vertical() {
    return this.type === 'vertical';
  };

  constructor() { }

  ngOnInit() {

  }
}
