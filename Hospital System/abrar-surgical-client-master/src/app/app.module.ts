import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule , HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ROUTES, RoutingModule } from './routing/routing.module';
import { LayoutModule } from './layout/layout.module';
import { UIModule } from './ui/ui.module';
import { PagesModule } from './pages/pages.module';

import { ChargesModule} from './charges/charges.module';
import {ConsultantModule} from './consultant/consultant.module';
import {PatientsModule} from './patients/patients.module';
import {RoomManagnmentModule} from './room-managnment/room-managnment.module';


import { AuthModule} from './auth/auth.module';
import { pageDataReducer } from './store/reducers/page-data.reducer';
import { appSettingsReducer } from './store/reducers/app-settings.reducer';
import { patientsReducer } from './store/reducers/patients.reducer';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';
import { AuthGuard } from './guards/auth-guard.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { Select2Module } from 'ng2-select2';
import { ExpenseModule } from './expense/expense.module';
import { ReportModule } from './report/report.module';

export function jwtTokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    Select2Module,
    ToastrModule.forRoot(),
 
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    StoreModule.forRoot({
      pageData: pageDataReducer,
      appSettings: appSettingsReducer,
      patients: patientsReducer
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: jwtTokenGetter,
        whitelistedDomains: [new RegExp('^null$')], //No Need For This
        
        headerName: 'authorization',
        //blacklistedRoutes: [environment.serverURL+'auth/login']
      }
    }),
    NgbModule.forRoot(),

    RoutingModule,
    LayoutModule,
    UIModule,
    PagesModule,
    ChargesModule,
    ConsultantModule,
    PatientsModule,
    RoomManagnmentModule,
    ReportModule,
    ExpenseModule,
    AuthModule
  ],
  providers: [AuthGuard,{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
