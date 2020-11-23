
import { DOCUMENT } from '@angular/common';
import { Component,Input, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
@Component({
  selector: 'app-indoor-bill',
  templateUrl: './indoor-bill.component.html',
  styleUrls: ['./indoor-bill.component.scss']
})
export class IndoorBillComponent implements OnInit ,OnDestroy {
  @Input() printChargesData;
  @Input() ChargesData;
  printCharge : {};
   a : any[];
   b : any[];
  constructor(
    
  ) {

    this. a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    this. b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
   }

  ngOnInit() {
   
    
    console.log("ALl Indoor Detail"+JSON.stringify(this.ChargesData));
    let grouped = {};

    this.ChargesData.forEach(function (a) {

      if(a.category=="Lab" || a.category=="X-Ray"){
        grouped[a.category] = grouped[a.category] || [];
      if(a.status=="active"){

      
      grouped[a.category].push({ total: a.charge,category:a.category });
      }
      }else{


      grouped[a.name] = grouped[a.name] || [];
      if(a.status=="active"){

      
      grouped[a.name].push({ total: a.charge,category:a.category });
      }
    }
  });

 

  /*var group_to_values = this.ChargesData.reduce(function (obj, item) {
    
    obj[item.name] = obj[item.name] || [];
    obj[item.name].push(item.total);
    return obj;
}, {});*/

var groups = Object.keys(grouped ).map(function (key) {
  return {name: key, data: grouped [key]};
});


let temp = [];

groups.forEach(function (a,index) {


  let total = 0;
  let count = 0;
  let day;
  a.data.forEach(function (b) {

      total = parseInt(b.total) + total;
      if(b.category=="Daily Charges" || b.category=="Room Charges"){
        count++;
        day = count+' days';
      }else{
        day = '';
      }
     
  
  });
  temp[index] = {
    name : a.name,
    total : total,
    day : day,
  }
  
});


  this.printCharge = temp;
  console.log("Modify"+JSON.stringify(this.printCharge));


  }

  ngOnDestroy(): void {
    
}

pad(d){
  return (d < 10) ? '0' + d.toString() : d.toString();
}


inWords (value) {
  let num: any = Number(value);
  if ((num = num.toString()).length > 9) return 'overflow';
 let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return; let str = '';
  str += (Number(n[1]) !== 0) ? (this.a[Number(n[1])] || this.b[n[1][0]] + ' ' + this.a[n[1][1]]) + 'crore ' : '';
        str += (Number(n[2]) !== 0) ? (this.a[Number(n[2])] || this.b[n[2][0]] + ' ' + this.a[n[2][1]]) + 'lakh ' : '';
        str += (Number(n[3]) !== 0) ? (this.a[Number(n[3])] || this.b[n[3][0]] + ' ' + this.a[n[3][1]]) + 'thousand ' : '';
        str += (Number(n[4]) !== 0) ? (this.a[Number(n[4])] || this.b[n[4][0]] + ' ' + this.a[n[4][1]]) + 'hundred ' : '';
        str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') +
        (this.a[Number(n[5])] || this.b[n[5][0]] + ' ' +
        this.a[n[5][1]]) + 'rupee' : '';
        return str;
}


}
