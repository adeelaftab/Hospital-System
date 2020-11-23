import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UIModule } from '../ui/ui.module';
import { LayoutModule } from '../layout/layout.module';
import { BasePageComponent } from './base-page';

import { MainPageComponent } from './main';
import { Page404Component } from './page-404';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ChartsModule,
    NgxChartsModule,
    NgxEchartsModule,
    UIModule,
    LayoutModule
  ],
  declarations: [
    BasePageComponent,
    MainPageComponent,
    Page404Component
  ],
  exports: [ ],
  entryComponents: [ ]
})
export class PagesModule {}
