import { Component, OnDestroy,AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalRoomTypeComponent} from '../modal/room-type/room-type.component';
import {RoomTypeService} from '../services/room-type.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss']
})
export class RoomTypeComponent extends BasePageComponent implements AfterViewInit, OnInit, OnDestroy {
  
  roomTypeData: any[];
  icons: string[];
  tc_data : {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject();
  constructor(
    store: Store<IAppState>,
    private modalService: NgbModal,
    private _RoomTypeService : RoomTypeService,
  ) {
    super(store);

    this.pageData = {
      title: 'Room Type',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Room Managnment'
        },
        {
          title: 'Room Type'
        }
      ]
    };
    this.roomTypeData = [];
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
      this._RoomTypeService.getAll()
      .subscribe(
        response => 
        {
          this.roomTypeData  = response;
         this.dtTrigger.next();
        },
        error => {
        console.log(error)
        });
    }



  addNewData() {
    const modalRef = this.modalService.open(ModalRoomTypeComponent,{ size: 'lg',backdrop:'static' });

    modalRef.result.then((result) => {
      this.rerender(); //Refresh Data TAble
    }).catch((error) => {
      console.log('from error >>');
      console.log(error);
    });
  }


  updateData(id,name,status)
  {
    const modalRef = this.modalService.open(ModalRoomTypeComponent,{ size: 'lg',backdrop:'static' });

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
