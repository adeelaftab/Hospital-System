import { Component, OnDestroy,AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ConsultantService} from '../services/consultant.service';
import {ModalViewConsultantComponent} from '../modal/view-consultant/view-consultant.component';
import {ModalConsultantFormComponent} from '../modal/consultant-form/consultant-form.component';
@Component({
  selector: 'app-consultant-list',
  templateUrl: './consultant-list.component.html',
  styleUrls: ['./consultant-list.component.scss']
})
export class ConsultantListComponent extends BasePageComponent implements AfterViewInit, OnInit, OnDestroy {
  icons: string[];
  consultantData: any[];
  tc_data : {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject();
  constructor(
    store: Store<IAppState>,
    private modalService: NgbModal,
   private _consultantService : ConsultantService,
  ) {
    super(store);

    this.pageData = {
      title: 'Consultant List',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Consultant'
        },
        {
          title: 'Consultant List'
        }
      ]
    };
    this.consultantData = [];
  }


  ngOnInit() {
    super.ngOnInit();
    this.dtOptions = {
      'columnDefs': [
        {
            "targets": 6, // your case first column
            "className": "text-center",
            //"width": "250"
       }],
    }; 
  }

  ngAfterViewInit(): void {
    this.getAllData();
  }

  getAllData()
    {
      this._consultantService.getAll()
      .subscribe(
        response => 
        {
          this.consultantData  = response;
         this.dtTrigger.next();
        },
        error => {
        console.log(error)
        });
    }



  addNewData() {
    const modalRef = this.modalService.open(ModalConsultantFormComponent,{ size: 'lg',backdrop:'static' });

    modalRef.result.then((result) => {
      this.rerender(); //Refresh Data TAble
    }).catch((error) => {
      console.log('from error >>');
      console.log(error);
    });
  }

  viewDetail(id) {
    const modalRef = this.modalService.open(ModalViewConsultantComponent,{ size: 'lg',backdrop:'static' });
    modalRef.componentInstance._id = id;
    modalRef.result.then((result) => {
    }).catch((error) => {
      console.log(error);
    });
  }


  updateData(id)
  {
    const modalRef = this.modalService.open(ModalConsultantFormComponent,{ size: 'lg',backdrop:'static' });

    
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
