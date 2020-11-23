import { Component, OnInit, HostBinding, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'tc-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class TCAlertComponent implements OnInit {
	@HostBinding('class.tc-alert') true;
	@HostBinding('class.outline') get getOutline() { return this.outline }
	@HostBinding('class.with-before-icon') @Input() beforeIcon: string;
	@HostBinding('class.with-after-icon') @Input() afterIcon: string;
	@HostBinding('class.alert-default') get default() { return this.view === 'default' }
	@HostBinding('class.alert-accent') get accent() { return this.view === 'accent' }
	@HostBinding('class.alert-success') get success() { return this.view === 'success' }
	@HostBinding('class.alert-error') get error() { return this.view === 'error' }
	@HostBinding('class.alert-info') get info() { return this.view === 'info' }
	@HostBinding('class.alert-warning') get warning() { return this.view === 'warning' }
	
	@Input() title: string;
	@Input() view: string;
	@Input() removable: boolean;
	@Input() outline: boolean;

  constructor(private element: ElementRef) {
		this.view = 'default';
	}

	ngOnInit() { }
	
	removeAlert() {
		this.element.nativeElement.remove();
	}
}
