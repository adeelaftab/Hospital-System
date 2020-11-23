import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { ITimelineBox } from '../../interfaces/timeline';

@Component({
  selector: 'tc-v-timeline',
  templateUrl: './v-timeline.component.html',
  styleUrls: ['./v-timeline.component.scss']
})
export class TCVTimelineComponent implements OnInit {
  @HostBinding('class.tc-v-timeline') true;
  @HostBinding('class.show-years') @Input() showLabels: boolean;
  @HostBinding('class.dots')  get dots() {
    return !this.showIcons;
  };
  @HostBinding('class.align-left') get left() {
    return this.align === 'left';
  };
  @HostBinding('class.align-center') get center() {
    return this.align === 'center';
  };
  @HostBinding('class.align-right') get right() {
    return this.align === 'right';
  };
  @HostBinding('class.align-between') get between() {
    return this.align === 'between';
  };
  @Input() align: string;
  @Input() showIcons: boolean;
  @Input() data: ITimelineBox[];

  constructor() {
    this.align = 'left';
    this.showLabels = false;
    this.showIcons = true;
    this.data = [];
  }

  ngOnInit() { }
}
