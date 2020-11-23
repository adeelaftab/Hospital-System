import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { CustomValidator } from '../../helpers/validation';
import { ToastrService } from 'ngx-toastr';
import {Router,ActivatedRoute} from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

class Contact{
  mobile_no : number;
}

class Patient{

  name : string;
  patient_id : string;
  age : string;
  gender : string;
  status : string;
  contact : Contact
}



@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent extends BasePageComponent implements OnInit, OnDestroy {
  persons: Patient[];
  dtOptions: DataTables.Settings = {};
  constructor(
    store: Store<IAppState>,
    private router : Router,
    private route: ActivatedRoute,
    private http: HttpClient

  ) {
    super(store);

    this.pageData = {
      title: 'Patients',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Patient List'
        }
      ]
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            environment.serverURL+'/patient/datatable',
            dataTablesParameters, {}
          ).subscribe(resp => {
            this.persons = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'name' }, { data: 'patient_id' },{ data: 'age' },{ data: 'gender' },{ data: 'contact.mobile_no' },{ data: 'status' }]
    };

  }


  generateInovoice(id){
    console.log(id);
  this.router.navigate(['/vertical/select-invoice',id]);
}

updatePatient(id){
  this.router.navigate(['/vertical/update-patient',id]);
}

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
