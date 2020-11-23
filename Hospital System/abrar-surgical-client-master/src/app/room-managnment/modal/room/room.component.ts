import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from '../../../ui/interfaces/option';
import {RoomService} from '../../services/room.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from '../../../helpers/validation';

@Component({
  selector: 'medical-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class ModalRoomComponent implements OnInit {
  @Input() tc_data : {};
  @Input() _id :String;
  @Input() roomTypeData : IOption[];
  statusData: IOption[];
  myForm : FormGroup;
  loadingButton: boolean;


  constructor(public activeModal: NgbActiveModal,
    private _roomServices : RoomService,
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
      name: ['', Validators.required],
      room_type: ['', Validators.required],
      charges: ['', [Validators.required,CustomValidator.numberValidator]],
      status: ['active',Validators.required], //Default Value Set Active
    });
  }

// Save New Record
  saveData(valid: boolean) {
    if (valid) {
      this.loadingButton = true;
        this._roomServices.create(this.myForm.value)
        .subscribe(
          response => 
          {
            if(response){
              this.toastr.success('Success!', 'Room Added Successfully');
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
        this._roomServices.update(this._id,this.myForm.value)
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


  //Reset All Form Fields
  resetForm() {
    this.myForm.reset();
    this.loadingButton = false;
  }
  

}
