import {Directive, EventEmitter, ElementRef, Renderer, HostListener, Input, Output} from '@angular/core';

function setProperty(renderer: Renderer, elementRef: ElementRef, propName: string, propValue: any): void {
  renderer.setElementProperty(elementRef, propName, propValue);
}

@Directive({
  selector: '[tcFilterTable]'
})
export class TCFilterTableDirective {

	@Input() public tcFilterTable: any = {};

  @Output() public tableChanged: EventEmitter<any> = new EventEmitter();

  @Input()
  public get config(): any {
    return this.tcFilterTable;
	}
	
	public constructor(element: ElementRef, renderer: Renderer) {
		this.element = element;
		this.renderer = renderer;
	}

  public set config(value: any) {
    this.tcFilterTable = value;
  }

  private element: ElementRef;
  private renderer: Renderer;

  @HostListener('input', ['$event.target.value'])
  public onChangeFilter(event: any): void {
		this.tcFilterTable.filterString = event;
    this.tableChanged.emit({ filtering: this.tcFilterTable });
	}
}
