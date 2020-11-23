import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecializationComponent } from './specialization/specialization.component';
import { ConsultantListComponent } from './consultant-list/consultant-list.component';

import { DataTablesModule } from 'angular-datatables';
import { UIModule } from '../ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalSpecializationComponent } from './modal/specialization/specialization.component';
import { ModalViewConsultantComponent } from './modal/view-consultant/view-consultant.component';
import { ModalConsultantFormComponent } from './modal/consultant-form/consultant-form.component';
@NgModule({
  declarations: [
    SpecializationComponent,
    ModalSpecializationComponent,
    ConsultantListComponent,
    ModalViewConsultantComponent,
    ModalConsultantFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    UIModule
  ],
  entryComponents: [
    ModalSpecializationComponent,
    ModalViewConsultantComponent,
    ModalConsultantFormComponent
  ]
})
export class ConsultantModule { }
