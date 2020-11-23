import { Component, OnDestroy,AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalDailyChargesComponent} from '../modal/daily-charges/daily-charges.component';
import {DailyChargesService} from '../services/daily-charges.service';

import { Subject } from 'rxjs';
import { IOption } from '../../ui/interfaces/option';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}


@Component({
  selector: 'app-daily-charges',
  templateUrl: './daily-charges.component.html',
  styleUrls: ['./daily-charges.component.scss']
})
export class DailyChargesComponent extends BasePageComponent implements  OnInit, OnDestroy {
  
  chargesListData: any[];
  tc_data : {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject();
  constructor(
    store: Store<IAppState>,
    private modalService: NgbModal,
    private _dailychargesService : DailyChargesService,
    private http: HttpClient

  ) {
    super(store);

    this.pageData = {
      title: 'Daily Charges List',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Charges'
        },
        {
          title: 'Daily Charges List'
        }
      ]
    };
    //this.chargesListData = [];
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
            environment.serverURL+'/daily-charges/datatable',
            dataTablesParameters, {}
          ).subscribe(resp => {
            this.chargesListData = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'name' }, { data: 'status' }],
      
    }; 

  }

  /*ngAfterViewInit(): void {
    //this.getAllData();
  }*/

 

  getAllData()
    {
      this._dailychargesService.getAll()
      .subscribe(
        response => 
        {
          this.chargesListData  = response;
         this.dtTrigger.next();
        },
        error => {
        console.log(error)
        });
    }



  addNewData() {
    const modalRef = this.modalService.open(ModalDailyChargesComponent,{ size: 'lg',backdrop:'static' });
    modalRef.result.then((result) => {
      this.rerender(); //Refresh Data TAble
    }).catch((error) => {
      console.log('from error >>');
      console.log(error);
    });
  }


  updateData(id,name,charges,status)
  {
    const modalRef = this.modalService.open(ModalDailyChargesComponent,{ size: 'lg',backdrop:'static' });

    this.tc_data = {
      name : name,
      charges : charges,
      status : status
    }

    modalRef.componentInstance.tc_data =this.tc_data;
    modalRef.componentInstance._id = id;
    modalRef.result.then((result) => {
     this.rerender(); //Refresh Data 
    }).catch((error) => {
      console.log('from error >>');
      console.log(error);
    });
  } 





  rerender(): void {
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


  ngOnDestroy() {

    this.dtTrigger.unsubscribe();
    super.ngOnDestroy();
  }



  
}
