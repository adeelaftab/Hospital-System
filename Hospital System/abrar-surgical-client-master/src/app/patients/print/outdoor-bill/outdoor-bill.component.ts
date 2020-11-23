
import { DOCUMENT } from '@angular/common';
import { Component,Input, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
@Component({
  selector: 'app-outdoor-bill',
  templateUrl: './outdoor-bill.component.html',
  styleUrls: ['./outdoor-bill.component.scss']
})
export class OutdoorBillComponent implements OnInit ,OnDestroy {
  @Input() printChargesData;
  @Input() ChargesData;
    printCharge : {};
  constructor(
    @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.document.body, 'font');
	let foo  = [];
	console.log(this.ChargesData);
	let index = 0;
	 this.ChargesData.forEach(function (a) {

      if(a.status =="active"){
		  
		   foo[index] = {
            "category" :a.category,
            "name" : a.name,
            "charge" : a.charge,
            "discount" : a.discount,
            "total" : a.total,
            "status":a.status
          };
		  
		  index++;
		  
	  }
	  
	  
	  
  });
	
	this.printCharge = foo;
	
    
    //console.log("ALl Outdoor Detail"+JSON.stringify(this.printCharge));
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'font');
}

pad(d){
  return (d < 10) ? '0' + d.toString() : d.toString();
}


}
