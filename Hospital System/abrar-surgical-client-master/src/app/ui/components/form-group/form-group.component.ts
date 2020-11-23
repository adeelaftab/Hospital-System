import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'tc-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss']
})
export class TCFormGroupComponent implements OnInit {
  @HostBinding('class.tc-form-group') true;

  constructor() { }

  ngOnInit() { }
}
