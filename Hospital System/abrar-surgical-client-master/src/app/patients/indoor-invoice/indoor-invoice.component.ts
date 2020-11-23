import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../helpers/validation';
import {PatientService} from '../services/patient.service';
import {IndoorService} from '../services/indoor.service';
import { ToastrService } from 'ngx-toastr';
import { IOption } from '../../ui/interfaces/option';
import {Router,ActivatedRoute} from '@angular/router';
import {ChargesCategoryService} from '../../charges/services/charges-category.service';
@Component({
  selector: 'app-indoor-invoice',
  templateUrl: './indoor-invoice.component.html',
  styleUrls: ['./indoor-invoice.component.scss']
})
export class IndoorInvoiceComponent extends BasePageComponent implements OnInit, OnDestroy {

  infoForm : FormGroup;
  loadingButton: boolean;
  statusData: IOption[];
  indoorData : any[];
  chargesCategoryData : IOption[];
  id : string;
  message: String = '<data>';
  ChargesData : any[];
 

  constructor(
    store: Store<IAppState>,
    private formBuilder: FormBuilder,
    private _patientServices : PatientService,
    private _indoorServices : IndoorService,
    private _chargescategoryService : ChargesCategoryService,
    private router : Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    super(store);

    this.pageData = {
      title: 'Indoor Invoice',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Patients'
        },
        {
          title: 'indoor Invoice'
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
    this.getindoorInvoiceData();
    this.getActiveCategoryList();
    this.initForm();
    
    
  }

  initForm() {
    this.infoForm = this.formBuilder.group({
      info: new FormGroup({
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

        this._indoorServices.update(this.route.snapshot.paramMap.get("id"),Form)
        .subscribe(
          response => 
          {
            
            this.loadingButton = false;
            this.toastr.success('Success!', response.message);
            this.getindoorInvoiceData()
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


  

  getindoorInvoiceData()
  {
    this._indoorServices.viewDetail(this.route.snapshot.paramMap.get("id"))
    .subscribe(
      response => 
      {
        this.indoorData  = response;
        this.infoForm.get('info.description').setValue(response.info.description);
      
        let printfoo = [];

        response.charges.forEach(function (value, index) { 
         
          printfoo[index] = {
            "category" :value.category,
            "name" : (value.category === 'Room Charges' ? 'Room/Bed/NICU':value.name),
            "charge" : value.charge,
            "discount" : value.discount,
            "total" : value.total,
            "status":value.status
          };
        

        
          
        });

        this.ChargesData = printfoo;




        
      },
      error => {
      console.log(error)
      });
  }


  
 
  showMessage = function (data) {
   
    this.getindoorInvoiceData();
  }


  toTimestamp(strDate){
    let datum = Date.parse(strDate);
    return datum/1000;
 }

 discharge(name: string) {
  if(confirm("Are you sure to Discharge Patient "+name)) {
    
    this._indoorServices.discharge(this.route.snapshot.paramMap.get("id"))
        .subscribe(
          response => 
          {
            
            this.toastr.success('Success!', response.message);
            this.getindoorInvoiceData()
          },
          err => {
              if(err.status==400){
                console.log(err.error.errors);
             
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

  reload(evt: any){
    console.log(evt);
    if(evt.activeId=="tab-3"){
      this.router.navigateByUrl('/RefrshComponent', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/vertical/indoor',this.route.snapshot.paramMap.get("id")]));
    }
  }
}
