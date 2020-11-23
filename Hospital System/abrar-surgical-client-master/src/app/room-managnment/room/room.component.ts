import { Component, OnDestroy,AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalRoomComponent} from '../modal/room/room.component';
import {RoomService} from '../services/room.service';
import {RoomTypeService} from '../services/room-type.service';

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
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent extends BasePageComponent implements  OnInit, OnDestroy {
  
  roomData: any[];
  roomTypeData : IOption[];
  tc_data : {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject();
  constructor(
    store: Store<IAppState>,
    private modalService: NgbModal,
    private _RoomService : RoomService,
    private _RoomTypeService : RoomTypeService,
    private http: HttpClient

  ) {
    super(store);

    this.pageData = {
      title: 'Manage Room',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Room'
        },
        {
          title: 'Manage Room'
        }
      ]
    };
    //this.roomData = [];
    this.roomTypeData = [];
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
            environment.serverURL+'/room/datatable',
            dataTablesParameters, {}
          ).subscribe(resp => {
            this.roomData = resp.data;

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
    this._RoomTypeService.getActive()
      .subscribe(
        response => 
        {
          let foo  = [];
          response.forEach(function (value, index) {
            foo[index] = {
              "label" :value.name,
              "value" : value._id
            };
          });
          this.roomTypeData = foo;
        },
        error => {
        console.log(error)
        })

  }

  getAllData()
    {
      this._RoomService.getAll()
      .subscribe(
        response => 
        {
          this.roomData  = response;
         this.dtTrigger.next();
        },
        error => {
        console.log(error)
        });
    }



  addNewData() {
    const modalRef = this.modalService.open(ModalRoomComponent,{ size: 'lg',backdrop:'static' });
    modalRef.componentInstance.roomTypeData = this.roomTypeData;
    modalRef.result.then((result) => {
      this.rerender(); //Refresh Data TAble
    }).catch((error) => {
      console.log('from error >>');
      console.log(error);
    });
  }


  updateData(id,name,category_id,charges,status)
  {
    const modalRef = this.modalService.open(ModalRoomComponent,{ size: 'lg',backdrop:'static' });

    this.tc_data = {
      name : name,
      room_type : category_id,
      charges : charges,
      status : status
    }

    modalRef.componentInstance.tc_data =this.tc_data;
    modalRef.componentInstance._id = id;
    modalRef.componentInstance.roomTypeData = this.roomTypeData;
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
