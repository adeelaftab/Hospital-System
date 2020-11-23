import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../pages/base-page/base-page.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {ReportService} from '../report.service';
@Component({
  selector: 'app-detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent extends BasePageComponent implements OnInit, OnDestroy {


  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;
  outdoor : any;
  outdoor_sum : any;
  indoor : any;
  indoor_sum : any;
  active_indoor : any;
  active_indoor_sum : any;
  consultant : any;
  expense : any;
  expense_amount : number;
  fromto : String;
  constructor(
    store: Store<IAppState>,
    calendar: NgbCalendar,
    private _reportService : ReportService,
 
  ) {
    super(store);

    this.pageData = {
      title: 'Detail Report',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Report'
        },
        {
          title: 'Detail Report'
        }
      ]
    };
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getToday();


    this.outdoor_sum = {
      charges : 0,
      discount : 0,
      total : 0,
      pay : 0,
      remaining : 0
    }

    this.indoor_sum = {
      charges : 0,
      discount : 0,
      total : 0,
      pay : 0,
      balance : 0
    }

    this.active_indoor_sum = {
      charges : 0,
      discount : 0,
      total : 0,
      advanced : 0,
      pay : 0,
      balance : 0
    }



  }

  ngOnInit() {
    super.ngOnInit();

  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }


  submit(){

      if(this.fromDate){

        if(this.toDate==null){
          this.toDate = this.fromDate;
        }

        this.fromto = this.fromDate.day+'/'+this.fromDate.month+'/'+this.fromDate.year+' - '+this.toDate.day+'/'+this.toDate.month+'/'+this.toDate.year

        let form = {
          from : this.fromDate,
          to : this.toDate
        }

        this._reportService.getDetail(form)
        .subscribe(
          response => 
          {
            console.log(response);
            this.outdoor = response.outdoor;
            this.active_indoor = response.active_indoor;
            this.indoor = response.indoor;
            this.consultant = response.indoor;
            this.expense = response.expense;
            this.calsum();
          },
          error => {
          console.log(error)
          });



      }




  }


  calsum(){

    let outdoor_charges = 0;
    let outdoor_pay = 0;
    let outdoor_discount = 0;
    let outdoor_total = 0;
    let outdoor_remaining = 0;


    /* Consultant Outdoor Report Group Generate */

    let grouped = {};

    this.outdoor.forEach(element => {
      
      outdoor_charges = element.invoice.charges + outdoor_charges;
      outdoor_pay = element.invoice.pay + outdoor_pay;
      outdoor_discount = element.invoice.discount + outdoor_discount;
      outdoor_total = element.invoice.grand_total + outdoor_total;
      if(element.invoice.remaining > 0){
        outdoor_remaining = element.invoice.remaining + outdoor_remaining;
      }



      grouped[element.charges[0].consultant_id.name] = grouped[element.charges[0].consultant_id.name] || [];
      grouped[element.charges[0].consultant_id.name].push({ consultant_amount: element.invoice.consultant_amount,hospital_amount:element.invoice.hospital_amount });

      
    });

    var groups = Object.keys(grouped ).map(function (key) {
      return {name: key, data: grouped [key]};
    });

    let temp = [];

groups.forEach(function (a,index) {


  let total_amount = 0;
  let count = 0;
  let hospital_amount = 0;
  a.data.forEach(function (b) {

      total_amount = parseInt(b.consultant_amount) + total_amount;
      hospital_amount = parseInt(b.hospital_amount) + hospital_amount;
      count++;
     
  
  });
  temp[index] = {
    name : a.name,
    amount : total_amount,
    hospital : hospital_amount,
    count : count,
  }
  
});

this.consultant = temp;


 /* End Consultant Outdoor Report Group Generate */


    this.outdoor_sum = {
      charges : outdoor_charges,
      discount : outdoor_discount,
      total : outdoor_total,
      pay : outdoor_pay,
      remaining : outdoor_remaining
    }


    let active_indoor_charges = 0;
    let active_indoor_pay = 0;
    let active_indoor_advanced = 0;
    let active_indoor_discount = 0;
    let active_indoor_total = 0;
   


    this.active_indoor.forEach(element => {
      
      active_indoor_charges = element.invoice.charges + active_indoor_charges;
      active_indoor_pay = element.invoice.pay + active_indoor_pay;
      active_indoor_discount = element.invoice.discount + active_indoor_discount;
      active_indoor_total = element.invoice.grand_total + active_indoor_total;
      active_indoor_advanced = element.invoice.advanced + active_indoor_advanced;
      
      
    });

    this.active_indoor_sum = {
      charges : active_indoor_charges,
      discount : active_indoor_discount,
      total : active_indoor_total,
      pay : active_indoor_pay,
      advanced : active_indoor_advanced,
      balance : active_indoor_pay - active_indoor_total,
    }


    let indoor_charges = 0;
    let indoor_pay = 0;
    let indoor_discount = 0;
    let indoor_total = 0;
   


    this.indoor.forEach(element => {
      
      indoor_charges = element.invoice.charges + indoor_charges;
      indoor_pay = element.invoice.pay + indoor_pay;
      indoor_discount = element.invoice.discount + indoor_discount;
      indoor_total = element.invoice.grand_total + indoor_total;
      
      
      
    });

    this.indoor_sum = {
      charges : indoor_charges,
      discount : indoor_discount,
      total : indoor_total,
      pay : indoor_pay,
      balance : indoor_pay - indoor_total,
    }

    this.expense_amount = 0;
    this.expense.forEach(element => {
      
      this.expense_amount = element.amount + this.expense_amount;
      
      
      
    });

    




  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  
}
