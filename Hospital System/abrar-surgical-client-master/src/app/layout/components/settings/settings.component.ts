import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { IOption } from '../../../ui/interfaces/option';
import { IAppSettings } from '../../../interfaces/settings';
import { environment } from '../../../../environments/environment';
import { IAppState } from '../../../interfaces/app-state';
import * as SettingsActions from '../../../store/actions/app-settings.actions';

const LAYOUTS: IOption[] = [
  {
    label : 'Vertical',
    value : 'vertical'
  },
  {
    label : 'Horizontal',
    value : 'horizontal'
  }
];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  layouts: IOption[];
  defaultSettings: IAppSettings;
  settings: IAppSettings;
  downloadJsonHref: SafeUrl;

  constructor(
    private store: Store<IAppState>,
    private sanitizer: DomSanitizer,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.layouts = LAYOUTS;
    this.defaultSettings = environment.appSettings;
  }

  ngOnInit() {
    this.store.select('appSettings').subscribe(st => {
      if (st) {
        this.settings = st;
        !this.form ? this.initSettingsForm(st) : null;
        this.downloadSettings(st);
      }
    });
  }

  initSettingsForm(data: IAppSettings) {
    this.form = this.formBuilder.group({
      boxed: [data.boxed],
      layout: [data.layout],
      topbarBg: [data.topbarBg],
      sidebarBg: [data.sidebarBg]
    });

    this.form.valueChanges.pipe().subscribe(newData => {
      if (data.layout !== newData.layout) {
        this.changeLayout(newData.layout);
        data.layout = newData.layout;
      }

      if (data.boxed !== newData.boxed) {
        this.changeBoxed(newData.boxed);
        data.boxed = newData.boxed;
      }
    });
  }

  resetSettings(data: IAppSettings = this.defaultSettings) {
    this.store.dispatch(new SettingsActions.Reset());
    this.form.reset({
      boxed: [data.boxed],
      layout: [data.layout],
      topbarBg: [data.topbarBg],
      sidebarBg: [data.sidebarBg]
    });
  }

  downloadSettings(settings: IAppSettings) {
    const JSON_FILE = JSON.stringify(settings);
    const URI = this.sanitizer.bypassSecurityTrustUrl(`data:text/json;charset=UTF-8, ${encodeURIComponent(JSON_FILE)}`);

    this.downloadJsonHref = URI;
  }

  // update layout value in app store
  changeLayout(layout: string) {
    this.store.dispatch(new SettingsActions.Update({ layout: layout }));

    let url = this.router.url.split('/').filter(n => n);
    url[0] = layout;
    let route = url.join('/');

    setTimeout(() => {
      this.router.navigate([route]);
    });
  }

  // update boxed value in app store
  changeBoxed(boxed: boolean) {
    this.store.dispatch(new SettingsActions.Update({ boxed: boxed }));
  }

  // update topbar colors in app store
  changeTopbarColor(value: any) {
    this.store.dispatch(new SettingsActions.Update({
      topbarBg: value.color,
      topbarColor: value.contrast
    }));
  }

  // update sidebar colors in app store
  changeSidebarColor(value: any) {
    this.store.dispatch(new SettingsActions.Update({
      sidebarBg: value.color,
      sidebarColor: value.contrast
    }));
  }
}
