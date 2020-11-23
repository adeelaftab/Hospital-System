import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'tc-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class TCBadgeComponent implements OnInit {
	@HostBinding('class.tc-badge') true;
	@HostBinding('class.badge-xs') get xs() { return this.size === 'xs' };
	@HostBinding('class.badge-sm') get sm() { return this.size === 'sm'};
	@HostBinding('class.badge-lg') get lg() { return this.size === 'lg'};
	@HostBinding('class.default') get typeDefault() { return this.view === 'default'};
	@HostBinding('class.accent') get typeAccent() { return this.view === 'accent'};
	@HostBinding('class.success') get typeSuccess() { return this.view === 'success'};
	@HostBinding('class.info') get typeInfo() { return this.view === 'info'};
	@HostBinding('class.warning') get typeWarning() { return this.view === 'warning'};
	@HostBinding('class.error') get typeError() { return this.view === 'error'};
	@HostBinding('class.badge-outline') @Input() outline: boolean;

	@Input() view: string;
	@Input() size: string;

  constructor() {
		this.view = 'default';
		this.size = 'default';
	}

  ngOnInit() { }
}
