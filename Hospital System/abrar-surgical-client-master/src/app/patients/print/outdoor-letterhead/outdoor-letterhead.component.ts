import { Component,Input,OnInit } from '@angular/core';

@Component({
  selector: 'app-outdoor-letterhead',
  templateUrl: './outdoor-letterhead.component.html',
  styleUrls: ['./outdoor-letterhead.component.scss']
})
export class OutdoorLetterheadComponent implements OnInit {
  @Input() printData;
  constructor() { }

  ngOnInit() {
  }

}
