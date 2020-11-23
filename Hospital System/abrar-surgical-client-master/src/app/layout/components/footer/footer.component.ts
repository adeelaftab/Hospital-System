import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { IPageData } from '../../../interfaces/page-data';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @HostBinding('class.footer') true;
  @HostBinding('class.loaded') @Input() loaded: boolean;
  @HostBinding('class.boxed') @Input() boxed: boolean;

  @Input() pageData: IPageData;

  constructor(
    private modal: TCModalService
  ) { }

  ngOnInit() { }

  // open modal window
  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }
}
