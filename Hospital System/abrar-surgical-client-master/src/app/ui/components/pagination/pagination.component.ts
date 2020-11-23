import { Component, OnInit, HostBinding, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'tc-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class TCPaginationComponent implements OnInit, OnChanges {
	@HostBinding('class.tc-pagination') true;

	@Input() pagesNumber: number;
	@Input() pageNum: number;

	@Output() goToPage:EventEmitter<number> = new EventEmitter<number>();

	pages: Array<number>;

  constructor() { 
		this.pagesNumber = 1;
		this.pageNum = 1;
	}

	public changePage(page: number) {
		this.pageNum = page;
		this.goToPage.emit(page);
	}
	
	public nextPage() {
		if (this.pageNum < this.getLast()) {
			this.pageNum++;
			this.goToPage.emit(this.pageNum);
		}
	}

	public prevPage() {
		if (this.pageNum > 1) {
			this.pageNum--;
			this.goToPage.emit(this.pageNum);
		}
	}

  ngOnInit() {
		this.pages = Array.from(Array(this.pagesNumber),(x,i)=>i + 1);
	}

  ngOnChanges() {
    this.ngOnInit();
  }
	
	getLast(): number {
		return this.pages[this.pages.length - 1];
	}
}
