import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tc-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class TCAvatarComponent implements OnInit {
  @HostBinding('class.tc-avatar') true;
  @Input() src: string;
  @Input() initials: string;
  @Input() size: number;
  @Input() alt: string;
  @HostBinding('style.height') get height() {
    return `${this.size}px`;
  }
  @HostBinding('style.width') get width() {
    return `${this.size}px`;
  }
  @HostBinding('style.fontSize') get fontSize() {
    return `${this.size / 2}px`;
  }
  @HostBinding('class.avatar-loading') @Input() load: boolean;

  constructor() {
    this.size = 40;
  }

  ngOnInit() { }
}
