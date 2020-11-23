import { Component, OnDestroy,AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalSpecializationComponent} from '../modal/specialization/specialization.component';
import {SpecializationService} from '../services/specialization.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-specialization',
  templateUrl: './specialization.component.html',
  styleUrls: ['./specialization.component.scss']
})

export class SpecializationComponent extends BasePageComponent implements AfterViewInit, OnInit, OnDestroy {
 
  icons: string[];
  specializationData: any[];
  tc_data : {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject();
  constructor(
    store: Store<IAppState>,
    private modalService: NgbModal,
   private _specializationService : SpecializationService,
  ) {
    super(store);

    this.pageData = {
      title: 'Specialization',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Consultant'
        },
        {
          title: 'Specialization'
        }
      ]
    };
    this.specializationData = [];
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
      this._specializationService.getAll()
      .subscribe(
        response => 
        {
          this.specializationData  = response;
         this.dtTrigger.next();
        },
        error => {
        console.log(error)
        });
    }



  addNewData() {
    const modalRef = this.modalService.open(ModalSpecializationComponent,{ size: 'lg',backdrop:'static' });

    modalRef.result.then((result) => {
      this.rerender(); //Refresh Data TAble
    }).catch((error) => {
      console.log('from error >>');
      console.log(error);
    });
  }


  updateData(id,name,status)
  {
    const modalRef = this.modalService.open(ModalSpecializationComponent,{ size: 'lg',backdrop:'static' });

    this.tc_data = {
      name : name,
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
