import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../helpers/validation';
import {PatientService} from '../services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { IOption } from '../../ui/interfaces/option';
import {Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent extends BasePageComponent implements OnInit, OnDestroy {

  myForm : FormGroup;
  loadingButton: boolean;
  statusData: IOption[];
  ageData: IOption[];
  bloodGroup : IOption[];
  id : string;
  patientData  :any;
  gender: IOption[];
  constructor(
    store: Store<IAppState>,
    private formBuilder: FormBuilder,
    private _patientServices : PatientService,
    private router : Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    super(store);

    
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
      this.id = this.route.snapshot.paramMap.get("id");

      if(this.id){
        this.pageData = {
          title: 'Update Patient Record',
          loaded: true,
          breadcrumbs: [
            {
              title: 'Patients'
            },
            {
              title: 'Update Patients'
            }
          ]
        };
      }else{
        this.pageData = {
          title: 'Add New Patient',
          loaded: true,
          breadcrumbs: [
            {
              title: 'Patients'
            },
            {
              title: 'Add New Patients'
            }
          ]
        };
      }

      this.gender = [
        {
          "label": "Male",
          "value": "male"
        },
        {
          "label" : "Female",
          "value" : "female"
        },
      ];


      this.ageData = [
        {
          "label": "Year",
          "value": "year"
        },
        {
          "label" : "Month",
          "value" : "month"
        },
        {
          "label" : "Day",
          "value" : "day"
        },
      ];
      this.bloodGroup = [
        {
          "label": "A+",
          "value": "A+"
        },
        {
          "label" : "O+",
          "value" : "O+"
        },
        {
          "label" : "B+",
          "value" : "B+"
        },
        {
          "label" : "AB+",
          "value" : "AB+"
        },
        {
          "label" : "A-",
          "value" : "A-"
        },
        {
          "label" : "O-",
          "value" : "O-"
        },
        {
          "label" : "B-",
          "value" : "B-"
        },
        {
          "label" : "AB-",
          "value" : "AB-"
        },
      ];
  }

  ngOnInit() {
    super.ngOnInit();
    if(this.id){
      this.getPatientData();
    }
    
    this.initForm();

  }

  initForm() {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      relation: [''],
      age: ['',[Validators.required,CustomValidator.numberValidator]],
      age_type: ['year',Validators.required],
      blood_group : [''],
      cnic: [''],
      passport: [''],
      gender: ['',Validators.required],
      address: new FormGroup({
        city: new FormControl('Rawalpindi', Validators.required),
        country: new FormControl('Pakistan',Validators.required),
        location: new FormControl(''),
          }),
      contact: new FormGroup({
        mobile_no: new FormControl('', [Validators.required,CustomValidator.numberValidator]),
        whatsapp_no: new FormControl(''),
        email: new FormControl('',[Validators.email]),
          }),
          status: ['active',Validators.required], //Default Value Set Active
    });






  }


  getPatientData()
  {
    this._patientServices.viewDetail(this.route.snapshot.paramMap.get("id"))
    .subscribe(
      response => 
      {
        //this.patientData  = response;
        this.myForm.get('name').setValue(response.name);
        this.myForm.get('relation').setValue(response.relation);
        this.myForm.get('age').setValue(response.age);
        this.myForm.get('blood_group').setValue(response.blood_group);
        this.myForm.get('age_type').setValue(response.age_type);
        this.myForm.get('cnic').setValue(response.cnic);
        this.myForm.get('passport').setValue(response.passport);
        this.myForm.get('gender').setValue(response.gender);
      
        this.myForm.get('address.city').setValue(response.address.city);
        this.myForm.get('address.country').setValue(response.address.country);
        this.myForm.get('address.location').setValue(response.address.location);
        this.myForm.get('contact.mobile_no').setValue(response.contact.mobile_no);
        this.myForm.get('contact.whatsapp_no').setValue(response.contact.whatsapp_no);
        this.myForm.get('contact.email').setValue(response.contact.email);
       
      },
      error => {
      console.log(error)
      });
  }

  // Save New Record
  saveData(valid: boolean) {
    if (valid) {
      this.loadingButton = true;
        this._patientServices.create(this.myForm.value)
        .subscribe(
          response => 
          {
            if(response){
              this.toastr.success('Success!', 'Patient Successfully Registered');
              this.router.navigate(['/vertical/select-invoice',response.patient.id]);
              
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
      this._patientServices.update(this.id,this.myForm.value)
        .subscribe(
          response => 
          {
            
              this.toastr.success('Success!', response.message);
              this.router.navigate(['/vertical/patient-list']);
              
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

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
