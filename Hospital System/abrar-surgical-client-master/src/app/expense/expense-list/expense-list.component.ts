import { Component, OnDestroy,AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ExpenseFormComponent} from '../expense-form/expense-form.component';
import {ExpenseService} from '../service/expense.service';
import {ExpenseCateogoryService} from '../service/expense-cateogory.service'

import { Subject } from 'rxjs';
import { IOption } from '../../ui/interfaces/option';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {Router,ActivatedRoute} from '@angular/router';


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}


@Component({
  selector: 'app-expense',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent extends BasePageComponent implements  OnInit, OnDestroy {
  
  expenseListData: any[];
  expenseCategoryData : IOption[];
  tc_data : {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject();
  constructor(
    store: Store<IAppState>,
    private modalService: NgbModal,
    private _expenselistService : ExpenseService,
    private _expensecategoryService: ExpenseCateogoryService,
    private http: HttpClient,
    private router : Router,
    private route: ActivatedRoute,

  ) {
    super(store);

    this.pageData = {
      title: 'Expense List',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Expense'
        },
        {
          title: 'Expense List'
        }
      ]
    };

    this.expenseCategoryData = [];
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
            environment.serverURL+'/expense/datatable',
            dataTablesParameters, {}
          ).subscribe(resp => {
            this.expenseListData = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      
    }; 

    this.getActiveCategoryList();

  }

  /*ngAfterViewInit(): void {
    //this.getAllData();
  }*/

  getActiveCategoryList()
  {
    this._expensecategoryService.getActive()
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
          this.expenseCategoryData = foo;
        },
        error => {
        console.log(error)
        })

  }

  getAllData()
    {
      this._expenselistService.getAll()
      .subscribe(
        response => 
        {
          this.expenseListData  = response;
         this.dtTrigger.next();
        },
        error => {
        console.log(error)
        });
    }



  addNewData() {
    const modalRef = this.modalService.open(ExpenseFormComponent,{ size: 'lg',backdrop:'static' });
    modalRef.componentInstance.expenseCategoryData = this.expenseCategoryData;
    modalRef.result.then((result) => {
      this.rerender(); //Refresh Data TAble
    }).catch((error) => {
      console.log('from error >>');
      console.log(error);
    });
  }


  updateData(id,amount,category_id,note,status)
  {
    const modalRef = this.modalService.open(ExpenseFormComponent,{ size: 'lg',backdrop:'static' });

    this.tc_data = {
      amount : amount,
      category : category_id,
      note : note,
      status : status
    }

    modalRef.componentInstance.tc_data =this.tc_data;
    modalRef.componentInstance._id = id;
    modalRef.componentInstance.expenseCategoryData = this.expenseCategoryData;
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
