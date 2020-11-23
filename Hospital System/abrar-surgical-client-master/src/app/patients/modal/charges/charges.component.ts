import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from '../../../ui/interfaces/option';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from '../../../helpers/validation';
import {OutdoorService} from '../../services/outdoor.service';
import {IndoorService} from '../../services/indoor.service';
@Component({
  selector: 'medical-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss']
})
export class ModalChargesComponent implements OnInit {
  @Input() tc_data : any;
  @Input() _id :String;
  @Input() type :String;
  statusData: IOption[];
  myForm : FormGroup;
  loadingButton: boolean;


  constructor(public activeModal: NgbActiveModal,
    private _outdoorServices : OutdoorService,
    private _indoorServices : IndoorService,
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
     
     }

  ngOnInit() {
    this.initForm();
    this.onChanges();

    // Check if ID contain Value Than Set Values ( Update Scanario)

    console.log(this.tc_data);

    if(this._id){
      this.myForm.setValue(this.tc_data);
    }
    
  }


  initForm() {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      charges: ['', [Validators.required,CustomValidator.numberValidator]],
      discount: ['', [Validators.required,CustomValidator.numberValidator]],
      status: ['active',Validators.required], //Default Value Set Active
    });
  }

  onChanges(): void {
   /* this.myForm.get('charges').valueChanges.subscribe(val => {
      let discount = +this.myForm.get('discount').value;
      if(val < discount || val < 0){
        console.log("false");
        this.myForm.get('discount').setValue(0);

      }

    })

    this.myForm.get('discount').valueChanges.subscribe(val => {
      console.log(val);
      let charges = +this.myForm.get('charges').value;
      console.log(charges);
      if(val > charges || val < 0){
        console.log("true");
        this.myForm.get('discount').setValue(0);
      }


    })*/


  }


  discountChange()
  {
    let charges = +this.myForm.get('charges').value;
    let val = +this.myForm.get('discount').value;
    console.log(charges);
    if(val > charges || val < 0){
      console.log("true");
      this.myForm.get('discount').setValue(0);
      alert("Discount is less or equal than charges");
    }
  }

  chargesChange()
  {
    let discount = +this.myForm.get('discount').value;
    let val = +this.myForm.get('charges').value;
      if(val < discount || val < 0){
        console.log("false");
        this.myForm.get('discount').setValue(0);

      }
  }

  //Update Existing Record

  updateData(valid: boolean) {
    if (valid) {
      this.loadingButton = true;

      if(this.type=="indoor"){

        this._indoorServices.updateCharges(this._id,this.myForm.value)
        .subscribe(
          response => 
          {
            
              this.toastr.success('Success!', response.message);
              this.activeModal.close("success");
          },
          error => {
              this.loadingButton = false;
              
            this.toastr.error('Error',error.error.errors[0].msg);
            console.log(error);
              
          }
        );

      }else {
        this._outdoorServices.updateCharges(this._id,this.myForm.value)
        .subscribe(
          response => 
          {
            
              this.toastr.success('Success!', response.message);
              this.activeModal.close("success");
          },
          error => {
              this.loadingButton = false;
              
            this.toastr.error('Error',error.error.errors[0].msg);
            console.log(error);
              
          }
        );
      }

      
     
    }
  }


  //Reset All Form Fields
  resetForm() {
    this.myForm.reset();
    this.loadingButton = false;
  }
  

}
