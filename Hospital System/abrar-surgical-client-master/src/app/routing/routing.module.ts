import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth-guard.service';
import { VerticalLayoutComponent } from '../layout/vertical';
import { HorizontalLayoutComponent } from '../layout/horizontal';
import { PublicLayoutComponent } from '../layout/public';

import { MainPageComponent } from '../pages/main';
import { Page404Component } from '../pages/page-404';


import {ChargesCategoryComponent} from '../charges/charges-category/charges-category.component';
import {ChargesListComponent} from '../charges/charges-list/charges-list.component';

import {ConsultantListComponent} from '../consultant/consultant-list/consultant-list.component';
import {SpecializationComponent} from '../consultant/specialization/specialization.component';

import { SignInComponent } from '../auth/sign-in';

import { PatientFormComponent } from '../patients/patient-form/patient-form.component';
import { SelectInvoiceComponent } from '../patients/select-invoice/select-invoice.component';
import { SelectInvoiceIndoorComponent } from '../patients/select-invoice-indoor/select-invoice-indoor.component';
import { PatientsListComponent } from '../patients/patients-list/patients-list.component';
import { OutdoorListComponent } from '../patients/outdoor-list/outdoor-list.component';
import { TodayOutdoorListComponent } from '../patients/today-outdoor-list/today-outdoor-list.component';
import { IndoorListComponent } from '../patients/indoor-list/indoor-list.component';
import { ActiveIndoorListComponent } from '../patients/active-indoor-list/active-indoor-list.component';

import { OutdoorInvoiceComponent } from '../patients/outdoor-invoice/outdoor-invoice.component';
import { RoomComponent } from '../room-managnment/room/room.component';
import { RoomTypeComponent } from '../room-managnment/room-type/room-type.component';
import { DailyChargesComponent } from '../charges/daily-charges/daily-charges.component';
import { IndoorInvoiceComponent } from '../patients/indoor-invoice/indoor-invoice.component';
import { ExpenseListComponent } from '../expense/expense-list/expense-list.component';
import { ExpenseCateogryListComponent } from '../expense/expense-cateogry-list/expense-cateogry-list.component';
import { DetailReportComponent } from '../report/detail-report/detail-report.component';

const VERTICAL_ROUTES: Routes = [
  { path: 'dashboard', component: MainPageComponent },

  
  { path: 'charges-category', component: ChargesCategoryComponent },
  { path: 'charges-list', component: ChargesListComponent },
  { path: 'daily-charges', component: DailyChargesComponent },
  { path: 'consultant-list', component: ConsultantListComponent },
  { path: 'specialization', component: SpecializationComponent },

  { path: 'room', component: RoomComponent },
  { path: 'room-type', component: RoomTypeComponent },

  { path: 'detail-report', component: DetailReportComponent },





  { path: 'expense-category', component: ExpenseCateogryListComponent },
  { path: 'expense', component: ExpenseListComponent },

  { path: 'add-patient', component: PatientFormComponent},
  { path: 'update-patient/:id', component: PatientFormComponent},
  { path: 'patient-list', component: PatientsListComponent},
  { path: 'outdoor-list', component: OutdoorListComponent},
  { path: 'today-outdoor-list', component: TodayOutdoorListComponent},
  
   { path: 'indoor-list', component: IndoorListComponent},
  { path: 'active-indoor-list', component: ActiveIndoorListComponent},
  
  { path: 'select-invoice/:id', component: SelectInvoiceComponent},
  { path: 'select-invoice-indoor/:id', component: SelectInvoiceIndoorComponent},
  { path: 'outdoor/:id', component: OutdoorInvoiceComponent},
  { path: 'indoor/:id', component: IndoorInvoiceComponent},
  { path: '**', component: Page404Component , canActivate: [AuthGuard],}
];

const PUBLIC_ROUTES: Routes = [
  { path: 'sign-in', component: SignInComponent },
];

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/vertical/main',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'vertical',
    component: VerticalLayoutComponent,
    canActivate: [AuthGuard],
    children: VERTICAL_ROUTES
  },
  {
    path: 'horizontal',
    component: HorizontalLayoutComponent,
    children: VERTICAL_ROUTES
  },
  {
    path: 'public',
    component: PublicLayoutComponent,
    children: PUBLIC_ROUTES
  },
  {
    path: '**',
    component: VerticalLayoutComponent,
    children: VERTICAL_ROUTES
  }
];

@NgModule({
  imports: [

  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }
