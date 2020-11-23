import {Directive, EventEmitter, Input, Output, HostListener} from '@angular/core';

@Directive({
  selector: '[tcTableSort]'
})
export class TCSortTableDirective {
		@Input() public tcTableSort: any;
	  @Input() public column: any;
	  @Output() public sortChanged: EventEmitter<any> = new EventEmitter();
	
	  @Input()
	  public get config(): any {
	    return this.tcTableSort;
	  }
	
	  public set config(value: any) {
	    this.tcTableSort = value;
	  }
	
	  @HostListener('click', ['$event', '$target'])
	  public onToggleSort(event: any): void {
	  if (event) {
	    event.preventDefault();
		}
		
	  if (this.column.enableSorting) {
	    switch (this.column.sort) {
	      case 'asc': 
	        this.column.sort = 'desc';
	        break;
	      case 'desc': 
	        this.column.sort = '';
	        break;
	      default: 
	        this.column.sort = 'asc';
	        break;
			}
			this.sortChanged.emit(this.column);
		}
	}
}
