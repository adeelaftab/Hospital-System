import { Component, OnDestroy,AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { CustomValidator } from '../../helpers/validation';
import { ToastrService } from 'ngx-toastr';
import {Router,ActivatedRoute} from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseCateogoryFormComponent } from '../expense-cateogory-form/expense-cateogory-form.component';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import {ExpenseCateogoryService} from '../service/expense-cateogory.service';
@Component({
  selector: 'app-expense-cateogry-list',
  templateUrl: './expense-cateogry-list.component.html',
  styleUrls: ['./expense-cateogry-list.component.scss']
})
export class ExpenseCateogryListComponent extends BasePageComponent implements  OnInit, OnDestroy {

  categoryData: any[];
  icons: string[];
  tc_data : {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject();


  constructor(
    store: Store<IAppState>,
    private modalService: NgbModal,
    private _expensecategoryService : ExpenseCateogoryService,

  ) {
    super(store);

    this.pageData = {
      title: 'Expense Cateogory',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Expense'
        },
        {
          title: 'Expense Category'
        }
      ]
    };

    this.categoryData = [];
  }

  ngOnInit() {
    super.ngOnInit();
    this.dtOptions = {
      'columnDefs': [
        {
            "targets": 3, // your case first column
            "className": "text-center",
            //"width": "4%"
       }],
    }; 
  }

  ngAfterViewInit(): void {
    this.getAllData();
  }

  getAllData()
  {
    this._expensecategoryService.getAll()
    .subscribe(
      response => 
      {
        this.categoryData  = response;
       this.dtTrigger.next();
      },
      error => {
      console.log(error)
      });
  }


  addNewData() {
    const modalRef = this.modalService.open(ExpenseCateogoryFormComponent,{ size: 'lg',backdrop:'static' });
    modalRef.result.then((result) => {
      this.rerender();
    }).catch((error) => {
      console.log('from error >>');
      console.log(error);
    });
  }

  updateData(id,category_name,status)
  {
    const modalRef = this.modalService.open(ExpenseCateogoryFormComponent,{ size: 'lg',backdrop:'static' });

    this.tc_data = {
      category_name : category_name,
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
      this.getAllData();
    });
  }



  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    super.ngOnDestroy();
  }

}
