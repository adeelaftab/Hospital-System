import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../helpers/validation';
import {PatientService} from '../services/patient.service';
import {OutdoorService} from '../services/outdoor.service';
import { ToastrService } from 'ngx-toastr';
import { IOption } from '../../ui/interfaces/option';
import {Router,ActivatedRoute} from '@angular/router';
import {ChargesCategoryService} from '../../charges/services/charges-category.service';
@Component({
  selector: 'app-outdoor-invoice',
  templateUrl: './outdoor-invoice.component.html',
  styleUrls: ['./outdoor-invoice.component.scss']
})
export class OutdoorInvoiceComponent extends BasePageComponent implements OnInit, OnDestroy {

  infoForm : FormGroup;
  loadingButton: boolean;
  statusData: IOption[];
  outdoorData : any[];
  chargesCategoryData : IOption[];
  id : string;
  message: String = '<data>';
  ChargesData : any[];
 

  constructor(
    store: Store<IAppState>,
    private formBuilder: FormBuilder,
    private _patientServices : PatientService,
    private _outdoorServices : OutdoorService,
    private _chargescategoryService : ChargesCategoryService,
    private router : Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    super(store);

    this.pageData = {
      title: 'Outdoor Invoice',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Patients'
        },
        {
          title: 'Outdoor Invoice'
        }
      ]
    };
    this.id = this.route.snapshot.paramMap.get("id");
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
    this.getOutdoorInvoiceData();
    this.getActiveCategoryList();
    this.initForm();
    
    
  }

  initForm() {
    this.infoForm = this.formBuilder.group({
      info: new FormGroup({
        bp: new FormControl(''),
        pulse: new FormControl(''),
        temp: new FormControl(''),
        weight: new FormControl(''),
        description : new FormControl('')
          }),
    });

   
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


  updateInfo(valid: boolean) {
    if (valid) {
      this.loadingButton = true;
      let Form = JSON.stringify(this.infoForm.value);

        this._outdoorServices.update(this.route.snapshot.paramMap.get("id"),Form)
        .subscribe(
          response => 
          {
            
            this.loadingButton = false;
            this.toastr.success('Success!', response.message);
            this.getOutdoorInvoiceData()
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


  

  getOutdoorInvoiceData()
  {
    this._outdoorServices.viewDetail(this.route.snapshot.paramMap.get("id"))
    .subscribe(
      response => 
      {
        this.outdoorData  = response;
        this.infoForm.get('info.bp').setValue(response.info.bp);
        this.infoForm.get('info.pulse').setValue(response.info.pulse);
        this.infoForm.get('info.weight').setValue(response.info.weight);
        this.infoForm.get('info.temp').setValue(response.info.temp);
        this.infoForm.get('info.description').setValue(response.info.description);
        let foo  = [];
        response.charges.forEach(function (value, index) {


          foo[index] = {
            "category" :value.category,
            "name" : (value.category === 'Consultant' ? 'Consultantion Fee '+value.consultant_id.name : value.name),
            "charge" : value.charge,
            "discount" : value.discount,
            "total" : value.total,
            "status":value.status
          };
          
        });

        this.ChargesData = foo;




        
      },
      error => {
      console.log(error)
      });
  }


  
 
  showMessage = function (data) {
   
    this.getOutdoorInvoiceData();
  }

  reload(evt: any){
    console.log(evt);
    if(evt.activeId=="tab-3"){
      this.router.navigateByUrl('/RefrshComponent', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/vertical/outdoor',this.route.snapshot.paramMap.get("id")]));
    }
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    
  }
}
