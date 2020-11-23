import { Directive, ElementRef,  Input } from '@angular/core';

@Directive({
  selector: '[tcFocus]'
})
export class TCFocusDirective {
	@Input()
	set tcFocus(value: boolean){
		 if(value){
			 this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth',block: 'end'});
		 }
	}

	constructor(private elementRef: ElementRef){

	}
}

