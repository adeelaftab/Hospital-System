import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../helpers/validation';
import {PatientService} from '../services/patient.service';
import {OutdoorService} from '../services/outdoor.service';
import {ConsultantService} from '../../consultant/services/consultant.service';

import {HelperService} from '../../services/helper.service';


import { ToastrService } from 'ngx-toastr';
import { IOption } from '../../ui/interfaces/option';
import {Router,ActivatedRoute} from '@angular/router';

let shire ;

@Component({
  selector: 'app-select-invoice',
  templateUrl: './select-invoice.component.html',
  styleUrls: ['./select-invoice.component.scss']
})
export class SelectInvoiceComponent extends BasePageComponent implements OnInit, OnDestroy {
  myForm : FormGroup;
  loadingButton: boolean;
  statusData: IOption[];
  patientData : any;
  consultantData :IOption[];
  charges : any[];
  selectedCharges : String;

  constructor(
    store: Store<IAppState>,
    private formBuilder: FormBuilder,
    private _patientServices : PatientService,
    private _consultantServices : ConsultantService,
    private _outdoorServices : OutdoorService,
    private _smsServices : HelperService,
    private router : Router,
    private route: ActivatedRoute,
    private toastr: ToastrService


  ) {
    super(store);

    this.pageData = {
      title: 'Generate Slip',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Patients'
        },
        {
          title: 'Generate Slip'
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
    this.initForm();
    this.onChanges();

  }

  initForm() {
    this.myForm = this.formBuilder.group({
      bill_type: ['outdoor', Validators.required],
      patient_id: [this.route.snapshot.paramMap.get("id"), Validators.required],
      status: ['active', Validators.required],
      charges: new FormGroup({
        consultant: new FormGroup({
          consultant_id : new FormControl('', [Validators.required]),
          fee_type : new FormControl('', [Validators.required]),
          fee : new FormControl('', [Validators.required])
        }),
      }),
      payment: new FormGroup({
        total: new FormControl(0, [Validators.required,CustomValidator.numberValidator]),
        discount: new FormControl(0, [Validators.required,CustomValidator.numberValidator]),
        grand_total: new FormControl(0, [Validators.required,CustomValidator.numberValidator]),
        pay: new FormControl(0, [Validators.required,CustomValidator.numberValidator]),
        remaining: new FormControl('', [Validators.required,CustomValidator.numberValidator]),
        consulant_amount : new FormControl(''),
        hospital_amount : new FormControl(''),
        status : new FormControl(''),
          }),
    });
  }

  onChanges(): void {
    this.myForm.get('charges.consultant.consultant_id').valueChanges.subscribe(val => {
      console.log(this.consultantData);
      console.log(val);
      var index = this.consultantData.findIndex(obj => obj.value==val);
      let foo  = [];
      foo[0] = this.consultantData[index];
      
      this.charges = foo;
      console.log(this.charges);
      if(this.charges[0].charges.first_time){
        this.selectedCharges = 'first_time';
        this.myForm.get('charges.consultant.fee_type').setValue(this.selectedCharges);
        this.myForm.get('charges.consultant.fee').setValue(this.charges[0].charges.first_time);

        this.myForm.get('payment.total').setValue(this.charges[0].charges.first_time);
        this.myForm.get('payment.grand_total').setValue(this.charges[0].charges.first_time);
        this.myForm.get('payment.discount').setValue(0);
        this.myForm.get('payment.pay').setValue(this.charges[0].charges.first_time);
        this.calculateShareAmount(this.charges[0].charges.first_time,0,this.charges[0].charges.first_time_hospital_share);
        shire = this.charges[0].charges.first_time_hospital_share;

      }else if(this.charges[0].charges.normal){
        this.selectedCharges = 'normal';
        this.myForm.get('charges.consultant.fee_type').setValue(this.selectedCharges);
        this.myForm.get('charges.consultant.fee').setValue(this.charges[0].charges.normal);
        this.myForm.get('payment.total').setValue(this.charges[0].charges.normal);
        this.myForm.get('payment.grand_total').setValue(this.charges[0].charges.normal);
        this.myForm.get('payment.discount').setValue(0);
        this.myForm.get('payment.pay').setValue(this.charges[0].charges.normal);
        this.calculateShareAmount(this.charges[0].charges.normal,0,this.charges[0].charges.normal_hospital_share);
        shire = this.charges[0].charges.normal_hospital_share;
      
      }

   
    });


    this.myForm.get('payment.discount').valueChanges.subscribe(val => {

      let total = +this.myForm.get('payment.total').value;
      if(val > total ) {
      this.myForm.get('payment.grand_total').setValue(total);
      this.myForm.get('payment.discount').setValue('');
      }else{
        let discount_calculate = this.myForm.get('payment.total').value - val ;
        this.myForm.get('payment.grand_total').setValue(discount_calculate);
        this.myForm.get('payment.pay').setValue(discount_calculate);
        this.myForm.get('payment.remaining').setValue(0);

        this.calculateShareAmount(this.myForm.get('payment.total').value,val,shire);

      }

    });

    this.myForm.get('payment.pay').valueChanges.subscribe(val => {
      let grand_total = +this.myForm.get('payment.grand_total').value;
      if(val > grand_total ) {
      this.myForm.get('payment.remaining').setValue('0');
      this.myForm.get('payment.pay').setValue('');
      }else{
        let calculate = this.myForm.get('payment.grand_total').value - val ;
        this.myForm.get('payment.remaining').setValue(calculate);
      }

    });




  }



  calculateShareAmount(charges,discount,share){

    

    let hospital_amount_percentage = (+share * 100) / charges ;
    let hospital_amount = +share;
    hospital_amount = Math.ceil(hospital_amount);
    hospital_amount_percentage = Math.ceil(hospital_amount_percentage);

    let consultant_amount  = +charges - hospital_amount ;

    console.log("Hospital_Amount"+hospital_amount);
    console.log("Hospital_Amount Percentage"+hospital_amount_percentage);
    console.log("Consultant_Amount"+consultant_amount);

    //If Discount Applied

    if(discount > 0) {

      let hosdis = (+hospital_amount_percentage * discount) / 100 ;

      hosdis = Math.ceil(hosdis);

      hospital_amount = hospital_amount - hosdis ;
      consultant_amount = consultant_amount - (discount - hosdis);

      console.log("Hospital_Amount"+hospital_amount);
      console.log("Consultant_Amount"+consultant_amount); 


    }


    this.myForm.get('payment.hospital_amount').setValue(hospital_amount);
    this.myForm.get('payment.consulant_amount').setValue(consultant_amount);



  }

  setClickedRow(index,charges,share){
    this.selectedCharges = index;
    this.myForm.get('charges.consultant.fee_type').setValue(this.selectedCharges);
    this.myForm.get('charges.consultant.fee').setValue(charges);
    this.myForm.get('payment.total').setValue(charges);
    this.myForm.get('payment.grand_total').setValue(charges);
    this.myForm.get('payment.discount').setValue(0);
    this.myForm.get('payment.pay').setValue(charges);
    shire  = share;
    this.calculateShareAmount(charges,0,share);
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

      let remaining = this.myForm.get('payment.remaining').value;

     if(remaining > 0) {
      this.myForm.get('payment.status').setValue('due');
     }else{
      this.myForm.get('payment.status').setValue('paid');
     }



        this._outdoorServices.create(this.myForm.value)
        .subscribe(
          response => 
          {
            if(response){
              this.toastr.success('Success!', response.message);
              let message = 'Thank you for visiting Abrar Surgery. Your patient id is '+this.patientData.patient_id+' and payment has been received Rs '+this.myForm.get('payment.pay').value+'/-';
              this.sendSms(this.patientData.contact.mobile_no,message);
              this.router.navigate(['/vertical/outdoor',response.outdoor.id]);
              
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


  selectIndoor()
  {
    this.router.navigate(['/vertical/select-invoice-indoor',this.route.snapshot.paramMap.get("id")]);
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