import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { CustomValidator } from '../../helpers/validation';
import { ToastrService } from 'ngx-toastr';
import {Router,ActivatedRoute} from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

declare var $: any;
import { Select2OptionData } from 'ng2-select2';
import { elementEnd } from '@angular/core/src/render3';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}


@Component({
  selector: 'today-outdoor-list',
  templateUrl: './today-outdoor-list.component.html',
  styleUrls: ['./today-outdoor-list.component.scss']
})


export class TodayOutdoorListComponent extends BasePageComponent implements AfterViewInit, OnDestroy, OnInit {

  public exampleData: Array<Select2OptionData>;
  persons: any[];
  
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject();

  public selected: string;

  public search_outdoor_id ='';
  public search_patient_id ='';
  public search_patient_name ='';
  public search_consultant ='';
  public search_patient_phone ='';
  public search_payment_status ='';

  public outdoor_id_ajax: Select2AjaxOptions;
  public patient_id_ajax: Select2AjaxOptions;
  public patient_name_ajax: Select2AjaxOptions;
  public consultant_ajax: Select2AjaxOptions;
  public patient_phone_ajax: Select2AjaxOptions;


  constructor(
    store: Store<IAppState>,
    private router : Router,
    private route: ActivatedRoute,
    private http: HttpClient

  ) {
    super(store);

    this.pageData = {
      title: 'Today Outdoor Patients',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Patients'
        },
        {
          title: 'Today Outdoor Patients'
        }
      ]
    };
  }

  ngOnInit() {
    super.ngOnInit();


  
    this.dtOptions = {
      pagingType: 'full_numbers',

      searching: false,
      pageLength: 50,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        let parameters = {invoice_id : this.search_outdoor_id,
          patient_id:this.search_patient_id,
          patient_name : this.search_patient_name,
          consultant : this.search_consultant,
          patient_phone : this.search_patient_phone,
          payment_status : this.search_payment_status
        
        
        
        };
        console.log(this.search_outdoor_id);
        this.http
          .post<DataTablesResponse>(
            environment.serverURL+'/outdoor/today-datatable',
            Object.assign(dataTablesParameters,parameters), {
              
            },
            
          ).subscribe(resp => {
            this.persons = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'invoice_id' }, { data: 'patient_id.name' }]
    };


    this.outdoor_id_ajax = {
      url: environment.serverURL+'/outdoor/get-outdoor-id',
      dataType: 'json',
      delay: 250,
      cache: false,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('access_token')
      },
      data: (params: any) => {
          console.log("AA", params);
          return {
            search: params.term
          }
      },
      processResults: (data: any) => {

          console.log('data: ', data);
          return {
              results: $.map(data, function(obj) {
                
                  return {id: obj.invoice_id, text: obj.invoice_id};
              }),
          };
      },

  };

  this.patient_id_ajax = {
    url: environment.serverURL+'/patient/get-patient-id',
    dataType: 'json',
    delay: 250,
    cache: false,
    headers: {
      "Authorization": "Bearer " + localStorage.getItem('access_token')
    },
    data: (params: any) => {
        console.log("AA", params);
        return {
          search: params.term
        }
    },
    processResults: (data: any) => {

        console.log('data: ', data);
        return {
            results: $.map(data, function(obj) {
             
                return {id: obj._id, text: obj.patient_id};
            }),
        };
    },

};

this.patient_name_ajax = {
  url: environment.serverURL+'/patient/get-patient-name',
  dataType: 'json',
  delay: 250,
  cache: false,
  headers: {
    "Authorization": "Bearer " + localStorage.getItem('access_token')
  },
  data: (params: any) => {
      console.log("AA", params);
      return {
        search: params.term
      }
  },
  processResults: (data: any) => {

      console.log('data: ', data);
      return {
          results: $.map(data, function(obj) {
            console.log(obj.id);
            console.log(obj.name);
              return {id: obj._id, text: obj.name};
          }),
      };
  },

};

this.patient_phone_ajax = {
  url: environment.serverURL+'/patient/get-phone-number',
  dataType: 'json',
  delay: 250,
  cache: false,
  headers: {
    "Authorization": "Bearer " + localStorage.getItem('access_token')
  },
  data: (params: any) => {
      console.log("AA", params);
      return {
        search: params.term
      }
  },
  processResults: (data: any) => {

      console.log('data: ', data);
      return {
          results: $.map(data, function(obj) {
            console.log(obj.id);
            console.log(obj.name);
              return {id: obj._id, text: obj.contact.mobile_no};
          }),
      };
  },

};

this.consultant_ajax = {
  url: environment.serverURL+'/consultant/get-consultant-list',
  dataType: 'json',
  delay: 250,
  cache: false,
  headers: {
    "Authorization": "Bearer " + localStorage.getItem('access_token')
  },
  data: (params: any) => {
      console.log("AA", params);
      return {
        search: params.term
      }
  },
  processResults: (data: any) => {

      console.log('data: ', data);
      return {
          results: $.map(data, function(obj) {
            console.log(obj.id);
            console.log(obj.name);
              return {id: obj._id, text: obj.name};
          }),
      };
  },

};



    $(document).ready(() => {

      /*$(".outdoor_id").select2({
        allowClear: true,
        ajax: {
          url: environment.serverURL+'/outdoor/get-outdoor-id',
          dataType: 'json',
          delay: 250,
          headers: {
            "Authorization": "Bearer " + localStorage.getItem('access_token')
          },
          data: function (params) {
            return {
              search: params.term
            };
          },

          processResults: function(data) {
            const results = [];
            data.forEach(function makeResults(element, index) {
              results.push({
                id: element._id,
                text: element.invoice_id
              });
            });
            return {
              results: results
            };
          }
      
        },
        placeholder: '',
        minimumInputLength: 3,
      });*/



    })

  }

  generateInovoice(id){
  this.router.navigate(['/vertical/outdoor',id]);
}

rerender(): void {
  console.log("TEst"+this.selected );
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next();
  });
}


ngAfterViewInit(): void {
  this.dtTrigger.next();
}

ngOnDestroy(): void {
  // Do not forget to unsubscribe the event
  this.dtTrigger.unsubscribe();
}

public payment_status_changed(e: any): void {
  this.search_payment_status = e.value;
}

public consultant_changed(e: any): void {
  this.search_consultant = e.value;
}

public patient_phone_changed(e: any): void {
  this.search_patient_phone = e.value;
}

public patient_id_changed(e: any): void {
  this.search_patient_id = e.value;
}

public patient_name_changed(e: any): void {
  this.search_patient_name = e.value;
}

public outdoor_id_changed(e: any): void {
  this.search_outdoor_id = e.value;
}

 
}

