import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {ConsultantService} from '../../services/consultant.service';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { IOption } from '../../../ui/interfaces/option';
import { ToastrService } from 'ngx-toastr';
import { SpecializationService } from '../../services/specialization.service';
import { CustomValidator } from '../../../helpers/validation';

@Component({
  selector: 'app-consultant-form',
  templateUrl: './consultant-form.component.html',
  styleUrls: ['./consultant-form.component.scss']
})
export class ModalConsultantFormComponent implements OnInit {

  @Input() tc_data : {};
  @Input() _id :String;
  statusData: IOption[];
  specializationData : IOption[];
  typeData: IOption[];
  myForm : FormGroup;
  loadingButton: boolean;

  constructor(public activeModal: NgbActiveModal,
    private _consultantService : ConsultantService,
    private _specializationService : SpecializationService,
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

      this.typeData = [
        {
          "label": "Indoor",
          "value": "indoor"
        },
        {
          "label" : "Outdoor",
          "value" : "outdoor"
        },
      ];

      this.specializationData = [];
     
     }

  ngOnInit() {
    this.initForm();
    this.onChanges();

    // Check if ID contain Value Than Set Values ( Update Scanario)
    this.getActiveSpecializationData();
    

   


  }

  getData(id){
    this._consultantService.updateDetail(id)
    .subscribe(
      response => 
      {
        this.myForm.setValue(response);
      },
      error => {
      console.log(error)
      })
  }

  getActiveSpecializationData()
  {
    this._specializationService.getActive()
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
          this.specializationData = foo;
          if(this._id){
            this.getData(this._id)
          }
        },
        error => {
        console.log(error)
        })
  }

  initForm() {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobile_no: ['',[CustomValidator.numberValidator]],
      office_no: [''],
      address: [''],
      email: ['', Validators.email],
      consultant_type: [''],
      specialization: ['',Validators.required],
      charges: new FormGroup({
        normal: new FormControl('', [Validators.required,CustomValidator.numberValidator,Validators.min(0)]),
        normal_hospital_share: new FormControl('', [Validators.required,CustomValidator.numberValidator,Validators.min(0)]),
        first_time: new FormControl('',[CustomValidator.numberValidator,Validators.min(0)]),
        first_time_hospital_share: new FormControl(''),
        seven_days: new FormControl('',[CustomValidator.numberValidator,Validators.min(0)]),
        seven_days_hospital_share: new FormControl(''),
          }),
          hospital_share : ['0', [Validators.required,CustomValidator.numberValidator,Validators.max(100),Validators.min(0)]],
      status: ['active',Validators.required], //Default Value Set Active
    });
  }



  onChanges(): void {

    this.myForm.get('charges.first_time').valueChanges.subscribe(val => {
      console.log(val);
      if(val){
        this.myForm.get('charges.first_time_hospital_share').setValidators([Validators.required,CustomValidator.numberValidator,Validators.min(0)]);
      }else{
        this.myForm.get('charges.first_time_hospital_share').clearValidators();
        this.myForm.get('charges.first_time_hospital_share').setValidators([CustomValidator.numberValidator,Validators.min(0)]);

      }
      this.myForm.get('charges.first_time_hospital_share').updateValueAndValidity();


    });

    this.myForm.get('charges.seven_days').valueChanges.subscribe(val => {
      if(val){
        console.log("True");
        this.myForm.get('charges.seven_days_hospital_share').setValidators([Validators.required,CustomValidator.numberValidator,Validators.min(0)]);
      }else{
        console.log("False");
        this.myForm.get('charges.seven_days_hospital_share').clearValidators();

        this.myForm.get('charges.seven_days_hospital_share').setValidators([CustomValidator.numberValidator,Validators.min(0)]);

      }

      this.myForm.get('charges.seven_days_hospital_share').updateValueAndValidity();
      

    });


    

  }

    


  
// Save New Record
saveData(valid: boolean) {
  if (valid) {
    this.loadingButton = true;

    
      this._consultantService.create(this.myForm.value)
      .subscribe(
        response => 
        {
          if(response){
            this.toastr.success('Success!', response.message);
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
      this._consultantService.update(this._id,this.myForm.value)
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
