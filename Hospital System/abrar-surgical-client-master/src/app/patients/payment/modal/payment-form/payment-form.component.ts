import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from '../../../../ui/interfaces/option';
import {PaymentService} from '../../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from '../../../../helpers/validation';
@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {
 @Input() tc_data : any;
 @Input() id : any;
  //@Input() _id :String;
  statusData: IOption[];
  myForm : FormGroup;
  loadingButton: boolean;
  max_value : number;


  constructor(public activeModal: NgbActiveModal,
    private _paymentService : PaymentService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
    ) {

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
      this.max_value = 1;
     }

  ngOnInit() {
    this.initForm();
    
    if(this.id){
      this.max_value = this.tc_data.remaining;
      this.myForm.patchValue({
        amount: this.tc_data.amount, 
        note: this.tc_data.note, 
      });

    }else {
      this.myForm.setValue(this.tc_data);
      this.max_value = this.tc_data.amount;
    }
    this.onChanges();

    // Check if ID contain Value Than Set Values ( Update Scanario)

   /* if(this._id){
      this.myForm.setValue(this.tc_data);
    }*/
    
  }


  initForm() {
    this.myForm = this.formBuilder.group({
      amount: ['', [Validators.required,CustomValidator.numberValidator]],
      note: [''],
      invoice_id:[''],
      invoice_type:[''],
      patient_id:[''],
      status: ['active',Validators.required], //Default Value Set Active
    });
  }

// Save New Record
  saveData(valid: boolean) {
    if (valid) {
      this.loadingButton = true;
        this._paymentService.create(this.myForm.value)
        .subscribe(
          response => 
          {
            if(response){
              this.toastr.success('Success!',response.message);
              this.activeModal.close("success");
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


  updateData(valid: boolean) {
    if (valid) {
      this.loadingButton = true;
        this._paymentService.update(this.id,this.myForm.value)
        .subscribe(
          response => 
          {
            if(response){
              this.toastr.success('Success!',response.message);
              this.activeModal.close("success");
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

  onChanges(): void {

    this.myForm.get('amount').valueChanges.subscribe(val => {
      
      this.myForm.get('amount').setValidators([Validators.required,CustomValidator.numberValidator,Validators.min(1),Validators.max(this.max_value)]);

      this.myForm.get('amount').updateValueAndValidity();


    });


  }


  //Update Existing Record
/*
  updateData(valid: boolean) {
    if (valid) {
      this.loadingButton = true;
        this._paymentService.update(this._id,this.myForm.value)
        .subscribe(
          response => 
          {
            
              this.toastr.success('Success!', response.message);
              this.activeModal.close("success");
          },
          err => {
              this.loadingButton = false;
              if(err.status==400){
                console.log(err.error.errors);
                this.toastr.error('Validation Error', err.error.errors[0].msg);
              }else
              {
                console.log(err);
              }
              
          }
        );

      
     
    }
  }*/


  //Reset All Form Fields
  resetForm() {
    this.myForm.reset();
    this.loadingButton = false;
  }
  

}
