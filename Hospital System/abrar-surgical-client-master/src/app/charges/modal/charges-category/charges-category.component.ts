import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from '../../../ui/interfaces/option';
import {ChargesCategoryService} from '../../services/charges-category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-charges-category',
  templateUrl: './charges-category.component.html',
  styleUrls: ['./charges-category.component.scss']
})
export class ModalChargesCategoryComponent implements OnInit {
  @Input() tc_data : {};
  @Input() _id :String;
  statusData: IOption[];
  myForm : FormGroup;
  loadingButton: boolean;


  constructor(public activeModal: NgbActiveModal,
    private _chargescategoryService : ChargesCategoryService,
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

    // Check if ID contain Value Than Set Values ( Update Scanario)

    if(this._id){
      this.myForm.setValue(this.tc_data);
    }
    
  }


  initForm() {
    this.myForm = this.formBuilder.group({
      category_name: ['', Validators.required],
      status: ['active',Validators.required], //Default Value Set Active
    });
  }

// Save New Record
  saveData(valid: boolean) {
    if (valid) {
      this.loadingButton = true;
        this._chargescategoryService.create(this.myForm.value)
        .subscribe(
          response => 
          {
            if(response){
              this.toastr.success('Success!', 'Charges Category Added Successfully');
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


  //Update Existing Record

  updateData(valid: boolean) {
    if (valid) {
      this.loadingButton = true;
        this._chargescategoryService.update(this._id,this.myForm.value)
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
  }


  //Reset All Form Fields
  resetForm() {
    this.myForm.reset();
    this.loadingButton = false;
  }
  

}
