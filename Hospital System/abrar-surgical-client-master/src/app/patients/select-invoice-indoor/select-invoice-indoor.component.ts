import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../helpers/validation';
import {PatientService} from '../services/patient.service';
import {IndoorService} from '../services/indoor.service';
import {ConsultantService} from '../../consultant/services/consultant.service';
import {RoomService} from '../../room-managnment/services/room.service';
import {HelperService} from '../../services/helper.service';
import { Select2OptionData } from 'ng2-select2';


import { ToastrService } from 'ngx-toastr';
import { IOption } from '../../ui/interfaces/option';
import {Router,ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-select-invoice-indoor',
  templateUrl: './select-invoice-indoor.component.html',
  styleUrls: ['./select-invoice-indoor.component.scss']
})
export class SelectInvoiceIndoorComponent extends BasePageComponent implements OnInit, OnDestroy {
  myForm : FormGroup;
  loadingButton: boolean;
  statusData: IOption[];
  patientData : any;
  consultantData :IOption[];
  charges : any[];
  selectedCharges : String;
  public roomData: Array<Select2OptionData>;
  today: Date;
  constructor(
    store: Store<IAppState>,
    private formBuilder: FormBuilder,
    private _patientServices : PatientService,
    private _consultantServices : ConsultantService,
    private _indoorServices : IndoorService,
    private _roomServices : RoomService,
    private _smsServices : HelperService,
    private router : Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,


  ) {
    super(store);
    setInterval(() => {this.today = new Date(Date.now() + 1*24*60*60*1000);}, 1);
    this.pageData = {
      title: 'Generate Slip Indoor',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Patients'
        },
        {
          title: 'Generate Slip Indoor'
        }
      ]
    };
    this.loadingButton = false;
      this.statusData = [
        {
          "label": "Active",
          "value": "active"
        },
        {
          "label" : "In Active",
          "value" : "inactive"
        },
      ];
  }

  ngOnInit() {
    super.ngOnInit();
    this.getPatientData();
    this.getConsultantData();
    this.getRoomData();
    this.initForm();

    this.roomData = [
  ];




  }
  

  initForm() {
    this.myForm = this.formBuilder.group({
      bill_type: ['indoor', Validators.required],
      patient_id: [this.route.snapshot.paramMap.get("id"), Validators.required],
      consultant_id : ['', Validators.required],
      room : [''],
      status: ['active', Validators.required],
      payment: new FormGroup({
        total: new FormControl(0),
        discount: new FormControl(0),
        grand_total: new FormControl(0),
        advanced :  new FormControl('', [Validators.required,CustomValidator.numberValidator]),
        pay: new FormControl(0),
        remaining: new FormControl(0),
        status : new FormControl('due'),
          }),
    });
  }


  changedRoom(e: any): void {
  
    this.myForm.get('room').setValue(e.value);
  }



  getConsultantData(){
    this._consultantServices.getActive()
      .subscribe(
        response => 
        {
          
          let foo  = [];
          response.forEach(function (value, index) {
            foo[index] = {
              "label" :value.name,
              "value" : value._id,
              "charges": value.charges,
            };
          });
          this.consultantData = foo;
        },
        error => {
        console.log(error)
        })
  }


  getRoomData() {
    this._roomServices.getAvailable()
    .subscribe(
      response => 
      {
        
        this.roomData = response;
      },
      error => {
      console.log(error)
      })
  }

  getPatientData()
  {
    this._patientServices.viewDetail(this.route.snapshot.paramMap.get("id"))
    .subscribe(
      response => 
      {
        this.patientData  = response;
      },
      error => {
      console.log(error)
      });
  }

  // Save New Record
  saveData(valid: boolean) {
    if (valid) {
      this.loadingButton = true;

      
        this._indoorServices.create(this.myForm.value)
        .subscribe(
          response => 
          {
            if(response){
              this.toastr.success('Success!', response.message);
              let message = 'Thank you for visiting Abrar Surgery. Your patient id is '+this.patientData.patient_id+' and payment has been received Rs '+this.myForm.get('payment.pay').value+'/-';
              this.sendSms(this.patientData.contact.mobile_no,message);
              this.router.navigate(['/vertical/indoor',response.indoor.id]);
              
            }
          },
          error => {
            this.loadingButton = false;
            this.toastr.error('Error',error.error.errors[0].msg);
            console.log(error);
          }
        );
    }
  }

  sendSms(number,message)
  {
    this._smsServices.send(number,message)
        .subscribe(
          response => 
          {
            console.log(response);
          },
          error => {
            
            console.log(error);
          }
        );
  }


  selectOutdoor()
  {
    this.router.navigate(['/vertical/select-invoice',this.route.snapshot.paramMap.get("id")]);
  }

    //Reset All Form Fields
    resetForm() {
      this.router.navigateByUrl('/RefrshComponent', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/vertical/select-invoice',this.route.snapshot.paramMap.get("id")])); 
    }

  

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}