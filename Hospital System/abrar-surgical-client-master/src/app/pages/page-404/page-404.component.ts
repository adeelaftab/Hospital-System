import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { HttpService } from '../../services/http/http.service';
import { BasePageComponent } from '../base-page';

@Component({
  selector: 'page-404',
  templateUrl: './page-404.component.html',
  styleUrls: ['./page-404.component.scss']
})
export class Page404Component extends BasePageComponent implements OnInit, OnDestroy {
  constructor(
    store: Store<IAppState>,
    
  ) {
    super(store);

    this.pageData = {
      title: 'Page not found!',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Dashboard',
          route: 'default-dashboard'
        },
        {
          title: 'Error!'
        }
      ]
    };
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
