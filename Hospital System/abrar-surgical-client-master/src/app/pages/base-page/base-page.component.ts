import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { IPageData } from '../../interfaces/page-data';
import { IAppState } from '../../interfaces/app-state';
import { HttpService } from '../../services/http/http.service';
import * as PageActions from '../../store/actions/page.actions';

@Component({
  selector: 'base-page',
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.scss']
})
export class BasePageComponent implements OnInit, OnDestroy {
  pageData: IPageData;

  constructor(
    public store: Store<IAppState>
  ) { }

  ngOnInit() {
    this.pageData ? this.store.dispatch(new PageActions.Set(this.pageData)) : null;
  }

  ngOnDestroy() {
    this.store.dispatch(new PageActions.Reset());
  }

  

  setLoaded(during: number = 0) {
    setTimeout(() => this.store.dispatch(new PageActions.Update({ loaded: true })), during);
  }
}
