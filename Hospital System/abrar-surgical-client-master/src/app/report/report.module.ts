import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailReportComponent } from './detail-report/detail-report.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { UIModule } from '../ui/ui.module';
import { RouterModule } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';
import { Select2Module } from 'ng2-select2';
import { NgxSimpleCountdownModule } from 'ngx-simple-countdown';
import { MinSign } from '../helpers/min.pipe';
import { FilterPipe } from '../helpers/filtercount';
@NgModule({
  declarations: [DetailReportComponent,MinSign,FilterPipe],
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
   

  ]
})
export class ReportModule { }
