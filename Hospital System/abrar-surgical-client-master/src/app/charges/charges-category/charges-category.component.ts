import { Component, OnDestroy,AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalChargesCategoryComponent} from '../modal/charges-category/charges-category.component';
import {ChargesCategoryService} from '../services/charges-category.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'page-main',
  templateUrl: './charges-category.component.html',
  styleUrls: ['./charges-category.component.scss']
})
export class ChargesCategoryComponent extends BasePageComponent implements AfterViewInit, OnInit, OnDestroy {
  
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
    private _chargescategoryService : ChargesCategoryService,
  ) {
    super(store);

    this.pageData = {
      title: 'Charges Type',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Charges'
        },
        {
          title: 'Category'
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
      this._chargescategoryService.getAll()
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
    const modalRef = this.modalService.open(ModalChargesCategoryComponent,{ size: 'lg',backdrop:'static' });

    modalRef.result.then((result) => {
      this.rerender(); //Refresh Data TAble
    }).catch((error) => {
      console.log('from error >>');
      console.log(error);
    });
  }


  updateData(id,category_name,status)
  {
    const modalRef = this.modalService.open(ModalChargesCategoryComponent,{ size: 'lg',backdrop:'static' });

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
