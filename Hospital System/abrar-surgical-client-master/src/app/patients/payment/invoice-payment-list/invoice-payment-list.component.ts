import { Component,Input,OnInit, OnDestroy,AfterViewInit, Output, EventEmitter } from '@angular/core';
import {PaymentService} from '../../services/payment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PaymentFormComponent} from '../modal/payment-form/payment-form.component';
@Component({
  selector: 'app-invoice-payment-list',
  templateUrl: './invoice-payment-list.component.html',
  styleUrls: ['./invoice-payment-list.component.scss']
})
export class InvoicePaymentListComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() data;
  @Input() payment_type;
  @Output() sendMessage: EventEmitter<String> = new EventEmitter<String>();
  paymentsData : any[]
  tc_data : {};
  constructor(
    private modalService: NgbModal,
    private _paymentServices : PaymentService,
  ) { }

  ngOnInit() {

    this.getPaymentList(this.data._id);
  }



  addNewPayment(){
    const modalRef = this.modalService.open(PaymentFormComponent,{ size: 'lg',backdrop:'static' });
    
   

    this.tc_data = {
      amount :this.data.invoice.remaining,
      note : '',
      invoice_id : this.data._id,
      invoice_type : this.payment_type,
      patient_id : this.data.patient_id._id,
      status : 'active'
    }

    modalRef.componentInstance.tc_data =this.tc_data;
    modalRef.result.then((result) => {
      this.sendMessage.emit("update");
      this.getPaymentList(this.data._id);
      
    }).catch((error) => {
      //console.log('from error >>');
      console.log(error);
    });
  }


  getPaymentList(id){

    this._paymentServices.viewInvoicePayment(id)
    .subscribe(
      response => 
      {
        
        
        this.paymentsData = response;
      },
      error => {
      console.log(error)
      })

  }


  updatePayment(id,amount,note){
    const modalRef = this.modalService.open(PaymentFormComponent,{ size: 'lg',backdrop:'static' });
    
    this.tc_data = {
      amount :amount,
      remaining : this.data.invoice.remaining,
      note : note,
      invoice_id : this.data._id,
      invoice_type : this.payment_type,
      patient_id : this.data.patient_id._id,
      status : 'active'
    }
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.tc_data =this.tc_data;
    modalRef.result.then((result) => {
      this.sendMessage.emit("update");
      this.getPaymentList(this.data._id);
      
    }).catch((error) => {
      //console.log('from error >>');
      console.log(error);
    });
  }

  ngAfterViewInit(): void {
    
  }
  
  ngOnDestroy(): void {
   
    this.getPaymentList(this.data._id);
  }

}
