import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {ConsultantService} from '../../services/consultant.service';

@Component({
  selector: 'app-view-consultant',
  templateUrl: './view-consultant.component.html',
  styleUrls: ['./view-consultant.component.scss']
})
export class ModalViewConsultantComponent implements OnInit {

  consultant : any;
  @Input() _id :String;

  constructor(public activeModal: NgbActiveModal,
    private _consultantService : ConsultantService,
    ) {
      this.consultant = [];
     }

  ngOnInit() {

    this._consultantService.viewDetail(this._id)
      .subscribe(
        response => 
        {
          this.consultant  = response;
        },
        error => {
        console.log(error)
        });
  }

}
