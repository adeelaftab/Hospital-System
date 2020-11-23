import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { UIModule } from '../ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectInvoiceComponent } from './select-invoice/select-invoice.component';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { OutdoorListComponent } from './outdoor-list/outdoor-list.component';
import { IndoorListComponent } from './indoor-list/indoor-list.component';
import { OutdoorLetterheadComponent } from './print/outdoor-letterhead/outdoor-letterhead.component';
import {NgxPrintModule} from 'ngx-print';
import { OutdoorInvoiceComponent } from './outdoor-invoice/outdoor-invoice.component';
import { IndoorInvoiceComponent } from './indoor-invoice/indoor-invoice.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OutdoorChargesComponent } from './charges/outdoor-charges/outdoor-charges.component';
import { IndoorChargesComponent } from './charges/indoor-charges/indoor-charges.component';
import { InvoicePaymentListComponent } from './payment/invoice-payment-list/invoice-payment-list.component';
import { PaymentListComponent } from './payment/payment-list/payment-list.component';
import { OutdoorBillComponent } from './print/outdoor-bill/outdoor-bill.component';
import { IndoorBillComponent } from './print/indoor-bill/indoor-bill.component';
import { PaymentFormComponent } from './payment/modal/payment-form/payment-form.component';
import { FilterPipe } from '../helpers/filter.pipe';
import { TodayOutdoorListComponent } from './today-outdoor-list/today-outdoor-list.component';
import { ActiveIndoorListComponent } from './active-indoor-list/active-indoor-list.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { Select2Module } from 'ng2-select2';
import { SelectInvoiceIndoorComponent } from './select-invoice-indoor/select-invoice-indoor.component';
import { NgxSimpleCountdownModule } from 'ngx-simple-countdown';
import { ModalChargesComponent } from './modal/charges/charges.component';
import { MinusSign } from '../helpers/minus.pipe';


@NgModule({
  declarations: [FilterPipe,MinusSign,SelectInvoiceComponent,ModalChargesComponent,PatientsListComponent, OutdoorListComponent,IndoorListComponent, OutdoorLetterheadComponent, OutdoorInvoiceComponent,IndoorInvoiceComponent,OutdoorChargesComponent,IndoorChargesComponent, InvoicePaymentListComponent, PaymentListComponent, OutdoorBillComponent,IndoorBillComponent, PaymentFormComponent, TodayOutdoorListComponent,ActiveIndoorListComponent,PatientFormComponent, SelectInvoiceIndoorComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    UIModule,
    RouterModule,
    NgxPrintModule,
    Select2Module,
    NgxSimpleCountdownModule,
  ],
  entryComponents: [
    PaymentFormComponent,
    ModalChargesComponent
  ],
  exports: [
   
    FilterPipe
  ],
  bootstrap: [OutdoorInvoiceComponent],
})
export class PatientsModule { }