import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChargesCategoryComponent } from './charges-category/charges-category.component';
import { ModalChargesCategoryComponent } from './modal/charges-category/charges-category.component';
import { DataTablesModule } from 'angular-datatables';
import { UIModule } from '../ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChargesListComponent } from './charges-list/charges-list.component';
import { DailyChargesComponent } from './daily-charges/daily-charges.component';
import { ModalChargesListComponent } from './modal/charges-list/charges-list.component';
import { ModalDailyChargesComponent } from './modal/daily-charges/daily-charges.component';
@NgModule({
  declarations: [
    ChargesCategoryComponent,
    ModalChargesCategoryComponent,
	ModalDailyChargesComponent,
    ChargesListComponent,
	DailyChargesComponent,
    ModalChargesListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    UIModule
  ],
  entryComponents: [
    ModalChargesCategoryComponent,
    ModalChargesListComponent,
	ModalDailyChargesComponent
  ]
})
export class ChargesModule { }
