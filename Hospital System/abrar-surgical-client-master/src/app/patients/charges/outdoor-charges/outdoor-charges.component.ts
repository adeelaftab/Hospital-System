import { AfterViewInit,Input, Component, OnDestroy, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { IOption } from '../../../ui/interfaces/option';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from '../../../helpers/validation';
import {ChargesCategoryService} from '../../../charges/services/charges-category.service';
import {ChargesListService} from '../../../charges/services/charges-list.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {OutdoorService} from '../../services/outdoor.service';
import {HelperService} from '../../../services/helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalChargesComponent } from '../../modal/charges/charges.component';
@Component({
  selector: 'app-outdoor-charges',
  templateUrl: './outdoor-charges.component.html',
  styleUrls: ['./outdoor-charges.component.scss']
})
export class OutdoorChargesComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() chargesCategoryData;
  @Output() sendMessage: EventEmitter<String> = new EventEmitter<String>();
  chargesListData : any[];
  charges_category : string;
  invoiceData : any[];
  outdoorCharges : any[];
  apiPush  : any[];
  dtOptions: any = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  @Input() _id;
  dtTrigger : Subject<any> = new Subject();
  totalCharges : number;
  totalDiscount : number;
  totalPay : number;
  loadingButton: boolean;
  submitButton  :boolean;
  remaining : number;
  tc_data : {};
  public searchString: string;

  constructor(
    private _chargescategoryService : ChargesCategoryService,
    private _chargeslistService : ChargesListService,
    private _outdoorServices : OutdoorService,
    private _helperServices : HelperService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {

    this.outdoorCharges = [];
    this.invoiceData = [];
    this.totalCharges = 0;
    this.totalDiscount = 0;
    this.totalPay = 0;
    this.submitButton = false;
    this.loadingButton = false;
   }

  ngOnInit() {
    //this.getActiveCategoryList();
    this.getOutDoorCharges(this._id);
    this.dtOptions = {
      
      paging : false,
      searching: false,
      //ordering: false,
      info: false,
      "columnDefs": [
        {
            "targets": [ 0 ],
            "visible": false,
            "searchable": false,
        },
        {
          "targets": [ 1 ],
          "orderable": false
      },
      {
        "targets": [ 2 ],
        "orderable": false
      },
      {
        "targets": [ 3 ],
        "orderable": false
    },
    {
      "targets": [ 4 ],
      "orderable": false
    },
    {
    "targets": [ 5 ],
    "orderable": false
    },
       

    ],
      rowGroup: { //Igonre Warninig 
        dataSrc: 0
    },
      
    };
  }


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

  getChargesList(val)
{
  this._chargeslistService.getByCategoryActive(val)
  .subscribe(
    response => 
    {
      
      this.chargesListData = response;
     
    },
    error => {
    console.log(error)
    })
}

getOutDoorCharges(id){
  return new Promise((resolve) => {
  this._outdoorServices.viewCharges(id)
  .subscribe(
    response => 
    {
      this.remaining = response.invoice.remaining;
      this.totalPay = response.invoice.pay;
      console.log(this.remaining);
      let foo  = [];
      
          response.charges.forEach(function (value, index) {


            foo[index] = {
              "category" :value.category,
              "_id":value._id,
              "name" : (value.category === 'Consultant' ? value.consultant_id.name : value.name),
              "charges_id" : (value.charges_id ? value.charges_id : null),
              "charge" : value.charge,
              "discount" : value.discount,
              "total" : value.total,
              "edit" : false,
              "status":value.status,
            };

            
            
            
          });
          this.outdoorCharges = foo;
          this.calculateData();
          console.log(this.outdoorCharges);
          this.rerender();
          resolve();
        },
    error => {
    console.log(error)
    })

  });

}


calculateData(){
  let b = false;
  let d = 0;
  let c = 0;
  this.outdoorCharges.forEach(function (value, index) {
    if(value.edit == true){
        b = true;
    }

    if(value.status=="active"){
      d = d + +value.discount;
      c = c + +value.charge;
    }



})

this.totalCharges = c;
this.totalDiscount = d;
this.submitButton = b;
}


addCharges(data){
//console.log(data);
//Check If Already Exist Or Not
let foo = true;
this.outdoorCharges.forEach(function (value, index) {
    if(value.charges_id ===data._id){
        foo = false;
    }
})

if(foo){

  

  this.outdoorCharges.push({
    "category":data.category.category_name,
    "name":data.name,
    "charge":data.charges,
    "charges_id" : data._id,
    "discount":0,
    "total":data.charges,
    "diag_id":(data.diag_id ? data.diag_id : null),
    "status":'active',
    "edit":true
  });
    this.calculateData();
    //console.log(this.outdoorCharges);
    this.rerender();

}else {

  this.toastr.error('Error',data.name+" Already Applied");

}

}

removeCharges(data,index){
  console.log("Remove Data"+index);
  console.log("Remove Data"+JSON.stringify(data));
  this.outdoorCharges.splice(index, 1);
  console.log(this.outdoorCharges);
  this.calculateData();
  this.rerender();

}


submitData(){
let foo = [];
let i = 0;
let temp_remaining = 0;
let api = [];
this.outdoorCharges.forEach(function (value, index) {
  if(value.edit == true){
   
    foo[i] = {
      "category" :value.category,
      "name" : value.name,
      "charge" : value.charge,
      "charges_id" : value.charges_id,
      "discount" : value.discount,
      "total" : value.total,
      "status" : 'active'
    };

    console.log("Value"+JSON.stringify(value));

    if(value.diag_id){
      api[i] = {
        "name" : value.name,
        "charge" : value.charge,
        "charges_id" : value.charges_id,
        "diag_id": value.diag_id,
        "discount" : value.discount,
        "total" : value.total,
        "status" : 'active'
      };

    }



    temp_remaining = temp_remaining + +value.total
    i++;
  }
})

this.apiPush = api;
let status;

let rem_ = 0;

if(foo.length == 0){

  let paid = this.totalPay;
  let rem = (+this.totalCharges - +this.totalDiscount) - paid;
  if(rem > 0){
    status = 'due';
  }else{
    status = 'paid';
  }


  rem_ = rem;

 

}else {

  if(this.remaining > 0) {
    status = 'due';
  } else if(temp_remaining > 0){
    status = 'due';
  }else {
    status = 'paid';
  }

  rem_ = +this.remaining + temp_remaining;

}


let temp = {
  charges : +this.totalCharges,
  discount : +this.totalDiscount,
  grand_total : (+this.totalCharges - +this.totalDiscount),
  remaining : rem_,
  status : status,
  list : foo
}

this._outdoorServices.addCharges(this._id,temp)
  .subscribe(
    response => 
    {
      this.toastr.success('Success',response.message);
      this.apiPushDiagnostics();
      console.log(response);
      this.getOutDoorCharges(this._id);




      this.sendMessage.emit("update");
      

      },
    error => {
    console.log(error)
    })
//console.log("Sending Data To Server"+JSON.stringify(foo));
 //emmiting the event.


}


apiPushDiagnostics(){

  this._helperServices.apiPush(this._id,this.apiPush)
  .subscribe(
    response => 
    {
      //this.toastr.success('Success','Api Push TO Diag');
      console.log(response);
      

      },
    error => {
    console.log(error)
    })

}

updateCharges(data,index)
{

  if(index==0){
    alert("Permission Denied Contact Support");
    return;
  }



  const modalRef = this.modalService.open(ModalChargesComponent,{backdrop:'static' });

  this.tc_data = {
    name : data.name,
    discount : data.discount,
    charges : data.charge,
    status : data.status
  }

  modalRef.componentInstance.tc_data =this.tc_data;
  modalRef.componentInstance._id = data._id;
  modalRef.componentInstance.type = 'outdoor';
  modalRef.result.then((result) => {

  this.getOutDoorCharges(this._id).then(() => {
    this.submitData();
  });
    
    //this.submitData();
    
    
  }).catch((error) => {
    console.log('from error >>');
    console.log(error);
  });
}

ngAfterViewInit(): void {
  this.dtTrigger.next();
}

ngOnDestroy(): void {
  // Do not forget to unsubscribe the event
  this.dtTrigger.unsubscribe();
}

rerender(): void {
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next();
  });
}

}
