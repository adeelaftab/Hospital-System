import { Component, OnDestroy,AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalChargesListComponent} from '../modal/charges-list/charges-list.component';
import {ChargesListService} from '../services/charges-list.service';
import {ChargesCategoryService} from '../services/charges-category.service';

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
  selector: 'app-charges-list',
  templateUrl: './charges-list.component.html',
  styleUrls: ['./charges-list.component.scss']
})
export class ChargesListComponent extends BasePageComponent implements  OnInit, OnDestroy {
  
  chargesListData: any[];
  chargesCategoryData : IOption[];
  tc_data : {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject();
  constructor(
    store: Store<IAppState>,
    private modalService: NgbModal,
    private _chargeslistService : ChargesListService,
    private _chargescategoryService : ChargesCategoryService,
    private http: HttpClient

  ) {
    super(store);

    this.pageData = {
      title: 'Charges List',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Charges'
        },
        {
          title: 'Charges List'
        }
      ]
    };
    //this.chargesListData = [];
    this.chargesCategoryData = [];
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
            environment.serverURL+'/charges/datatable',
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

    this.getActiveCategoryList();

  }

  /*ngAfterViewInit(): void {
    //this.getAllData();
  }*/

  getActiveCategoryList()
  {
    this._chargescategoryService.getActive()
      .subscribe(
        response => 
        {
          let foo  = [];
          response.forEach(function (value, index) {
            foo[index] = {
              "label" :value.category_name,
              "value" : value._id
            };
          });
          this.chargesCategoryData = foo;
        },
        error => {
        console.log(error)
        })

  }

  getAllData()
    {
      this._chargeslistService.getAll()
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
    const modalRef = this.modalService.open(ModalChargesListComponent,{ size: 'lg',backdrop:'static' });
    modalRef.componentInstance.chargesCategoryData = this.chargesCategoryData;
    modalRef.result.then((result) => {
      this.rerender(); //Refresh Data TAble
    }).catch((error) => {
      console.log('from error >>');
      console.log(error);
    });
  }


  updateData(id,name,category_id,charges,status)
  {
    const modalRef = this.modalService.open(ModalChargesListComponent,{ size: 'lg',backdrop:'static' });

    this.tc_data = {
      name : name,
      category : category_id,
      charges : charges,
      status : status
    }

    modalRef.componentInstance.tc_data =this.tc_data;
    modalRef.componentInstance._id = id;
    modalRef.componentInstance.chargesCategoryData = this.chargesCategoryData;
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
