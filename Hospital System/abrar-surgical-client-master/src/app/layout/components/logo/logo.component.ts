import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'logo',
  templateUrl: 'logo.component.html',
  styleUrls: ['logo.component.scss']
})
export class LogoComponent implements OnInit {
  @HostBinding('class.logo') true;
  @Input() src: string;
  @Input() width: number | string;
  @Input() height: number | string;
  @Input() alt: string;

  constructor() {
    this.width = 'auto';
    this.height = 'auto';
    this.alt = '';
  }

  ngOnInit() {}
}
