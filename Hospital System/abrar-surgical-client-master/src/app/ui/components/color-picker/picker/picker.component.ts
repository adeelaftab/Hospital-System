import {
	Component,
	OnInit,
	Output,
	HostBinding,
	HostListener,
	ViewChild,
	ElementRef,
	AfterViewInit,
	EventEmitter,
	Renderer2
} from '@angular/core';

export const pickerApear = trigger('pickerApear', [
  state('open', style({
    height: '100%',
    width: '100%',
    borderRadius: 0
    // display: 'block'
  })),
  state('close', style({
    height: '20px' ,
    width: '20px',
    borderRadius: '50%'
    // display: 'none'
  })),
  transition('open => close', animate('500ms ease-in-out')),
  transition('close => open', animate('600ms ease-in-out')),
]);

export const foreground = trigger('foreground', [
  state('open', style({
    zIndex: 3,
  })),
  state('close', style({
    zIndex: 3
    // display: 'none'
  })),
  transition('open => close', animate('500ms ease-in-out')),
  transition('close => open', animate('100ms 500ms ease-in-out')),
]);
import { ColorService } from '../../../../services/color/color.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
	selector: 'tc-picker',
	templateUrl: './picker.component.html',
	styleUrls: ['./picker.component.scss'],
	animations: [pickerApear, foreground ]
})
export class TCPickerComponent implements OnInit, AfterViewInit {
	@ViewChild('hue') hueElement: ElementRef;
	@ViewChild('color') colorElement: ElementRef;
	@ViewChild('colors') colorsElement: ElementRef;
	@ViewChild('picker') pickerElement: ElementRef;
	@ViewChild('transparency') transparencyElement: ElementRef;

	@HostBinding('class.tc-picker') true;
	@HostBinding('class.hide') get getState() { return !this.openPicker; }
	@HostBinding('class.open') get getOpenState() { return this.openPicker; }
	@HostBinding('class.gradient') get getGradientState() { return this.gradient; }
	@HostBinding('class.opened') get getClassOpened() { return this.opened; }
	@HostBinding('style.top') get getTopOffset() { return this.top + 'px'; }
	@HostBinding('style.left') get getLeftOffset() { return this.left + 'px'; }

	@Output() pickerClosed: EventEmitter<string>;
	@Output() pickerOpened: EventEmitter<string>;
	@Output() colorSelected: EventEmitter<{color: string, contrast: string}>;

	alphaChanel: boolean;
	showPalette: boolean;
	buttons: boolean;
	opened: boolean;
	gradient: boolean;
	
	hue: any;
	transparency: any;
	transparencyPosition: number;
	huePosition: number;
	hueHandlerColor: string;
	contrastColor: string;

	top: number;
	left: number;
	savedColor: string;

	color: any;
	displayedColor: string;
	newColor: string;

	circleRadius: number;
	S: number; V: number;
	
	mouseY: number;
	mouseX: number;
	width: number | string;
	
	clicked: boolean;
	openPicker: boolean;
	overlay: boolean;
	selectedHue: string;
	pickerSize: number;

	changingHue: boolean;
	changingColor: boolean;
	changingAlpha: boolean;

	palette: Array<string>;

	constructor(private colorSv: ColorService, private element: ElementRef, private renderer: Renderer2) {
		this.savedColor = '#0a48fd';
		this.hueHandlerColor = this.savedColor;
		this.newColor = this.savedColor;
		this.selectedHue = this.savedColor;

		this.S = 1; this.V = 1;
		this.circleRadius = 1;
		this.transparencyPosition = 1;

		this.alphaChanel = true;
		this.buttons = false;
		this.showPalette = true;
		this.opened = false;

		this.openPicker = false;

		this.pickerOpened = new EventEmitter<string>();
		this.pickerClosed = new EventEmitter<string>();
		this.colorSelected = new EventEmitter<{color: string, contrast: string}>();
	}

	ngOnInit() {
		this.getHueOfColor(this.savedColor);
		this.pickerSize = this.pickerElement.nativeElement.offsetHeight;
		this.NewColor = this.savedColor;
	}

	ngAfterViewInit() {
		if (this.transparencyElement) {
			this.transparency = this.transparencyElement.nativeElement;
		}
		this.hue = this.hueElement.nativeElement;
		this.color = this.colorElement.nativeElement;

		if (typeof this.width === 'number') {
			this.width = this.width + 'px';
		}

		this.renderer.setStyle(this.element.nativeElement, 'width', this.width);
		this.renderer.setStyle(this.colorsElement.nativeElement, 'height', (this.element.nativeElement.offsetWidth - 38) + 'px');

		this.pickerSize = this.pickerElement.nativeElement.offsetHeight;
		this.renderer.setStyle(this.element.nativeElement, 'height', this.pickerSize + 'px');
	}

	set NewColor(color: string) {
		if (this.colorSv.isValid(color)) {
			if (color.startsWith('#') && color.length === 7) {
				let temp = this.colorSv.hexToRgb(color);
				color = `rgb(${temp.r},${temp.g},${temp.b})`;
			}

			if (color.startsWith('rgb') || color.startsWith('rgba')) {
				let newColor: string = color.replace('rgba(', '').replace('rgb(', '');
				let colorArr: Array<number> = new Array<number>();
				newColor.split(',').forEach((x: string) => {
					colorArr.push(parseFloat(x));
				});

				this.contrastColor = this.colorSv.checkContrastColor(colorArr[0], colorArr[1], colorArr[2]);
				
				if (this.transparencyPosition < 1) {
					this.newColor = `rgba(${colorArr[0]},${colorArr[1]},${colorArr[2]},${this.transparencyPosition.toPrecision(2)})`;
				} else if (colorArr.length === 4) {
					this.transparencyPosition = parseFloat(colorArr[3].toPrecision(2));
					this.newColor = `rgba(${colorArr[0]},${colorArr[1]},${colorArr[2]},${colorArr[3].toPrecision(2)})`;
				} else {
					this.newColor = this.colorSv.rgbToHex(colorArr[0], colorArr[1], colorArr[2]);
				}

				this.saveColor();

				colorArr = this.colorSv.rgbToHsv(colorArr[0], colorArr[1], colorArr[2]);

				this.S = colorArr[1];
				this.V = colorArr[2];
				this.huePosition = colorArr[0];

				let hueColor: Array<number> = this.colorSv.hsvToRgb(this.huePosition, 1, 1);
				
				this.selectedHue = 'rgb(' + hueColor[0] + ',' + hueColor[1] + ',' + hueColor[2] + ')';
			}
		}
	}

	get NewColor() {
		return this.newColor;
	}

	@HostListener('document:click', ['$event'])
	onMouseOutsideClick(event) {
		if (this.openPicker) {
			if (!this.pickerElement.nativeElement.contains(event.target)) {
				this.hide();
			}
		}
	}

	@HostListener('mousedown', ['$event'])
	public onMouseClick(event: MouseEvent): void {
		this.clicked = true;
		if (this.color.contains(event.target)) {
			this.calculateColor(event);
		} else if (this.hue.contains(event.target)) {
			this.changeHue(event);
		} else if (this.transparency && this.transparency.contains(event.target)) {
			this.changeTransparency(event);
		}
	}

	@HostListener('document:mousemove', ['$event'])
	public onMouseMove(event: MouseEvent) {
		if (this.clicked) {
			if (this.changingAlpha) {
				this.changeTransparency(event);
			} else if (this.changingColor) {
				this.calculateColor(event);
			} else if (this.changeHue) {
				this.changeHue(event);
			}
		}
	}

	@HostListener('document:mouseup', ['$event'])
	public onMouseReleas() {
		this.clicked = false;
		this.changingAlpha = false;
		this.changingColor = false;
		this.changingHue = false;
	}

	public calculateColor(event: MouseEvent) {
		this.changingColor = true;
		this.mouseX = event.pageX - this.color.getBoundingClientRect().left;
		this.mouseY = event.pageY - this.color.getBoundingClientRect().top  - document.documentElement.scrollTop || window.pageYOffset;

		this.S = (Math.min(100, Math.max(0, Math.round((this.mouseX * 100) / this.color.offsetWidth)))) / 100;
		this.V = (100 - Math.min(100, Math.max(0, Math.round((this.mouseY * 100) / this.color.offsetHeight)))) / 100;

		let rgbColor: Array<number> = this.colorSv.hsvToRgb(this.huePosition, this.S, this.V);
		this.contrastColor =  this.colorSv.checkContrastColor(rgbColor[0], rgbColor[1], rgbColor[2]);

		if (this.transparencyPosition > 0.99) {
			this.newColor = this.colorSv.rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]);
		} else {
			this.newColor = `rgba(${rgbColor[0]},${rgbColor[1]},${rgbColor[2]},${this.transparencyPosition.toPrecision(2)})`;
		}

		this.saveColor();
	}

	public changeHue(event: MouseEvent) {
		this.changingHue = true;
		let handlerPosition: number = 
			(event.pageY - this.hue.getBoundingClientRect().top - 
			(document.documentElement.scrollTop || window.pageYOffset)) / (this.hue.offsetHeight);

		if (handlerPosition >= 0 && handlerPosition <= 1) {
			this.huePosition = handlerPosition;

			let color: Array<number> = this.colorSv.hsvToRgb(this.huePosition, 1, 1);
			this.contrastColor =  this.colorSv.checkContrastColor(color[0], color[1], color[2]);
			this.selectedHue = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';

			let newColor: Array<number> = this.colorSv.hsvToRgb(this.huePosition, this.S, this.V);
			// this.NewColor = 'rgb(' + newColor[0] + ',' + newColor[1] + ',' + newColor[2] + ')';
			this.NewColor = this.colorSv.rgbToHex(newColor[0], newColor[1], newColor[2]);
		}
	}

	public changeTransparency(event: MouseEvent) {
		this.changingAlpha = true;
		let handlerPosition: number = (event.pageX - this.transparency.getBoundingClientRect().left) / (this.transparency.offsetWidth);

		if (handlerPosition >= 0 && handlerPosition <= 1) {
			this.transparencyPosition = handlerPosition;

			if (this.NewColor.startsWith('rgb')) {
				this.changeAlpha(this.NewColor, this.transparencyPosition);
			} else if (this.NewColor.startsWith('#')) {
				let color = this.colorSv.hexToRgb(this.NewColor);
				this.changeAlpha(`rgb(${color.r}, ${color.g}, ${color.b})`, this.transparencyPosition);
			}
		}
	}

	public changeAlpha(color: string, alpha: number): void {
		if (color.startsWith('rgba(')) {
			this.NewColor = color.replace(/[\d\.]+\)$/g, `${alpha.toPrecision(2)})`);
		} else {
			this.NewColor = color.replace('rgb(', 'rgba(').replace(')', `,${alpha.toPrecision(2)})`);
		}

		if (alpha > 0.99) {
			this.transparencyPosition = 1;
			let rgbColor: Array<number> = color
				.replace('rgba(', '')
				.replace('rgb(', '')
				.replace(')', '')
				.split(',')
				.map((x: string) => {
					return parseInt(x, 10);
				});
				// this.NewColor = `rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`;
			this.NewColor = this.colorSv.rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]);
		}
	}

	public changeSchema() {
		if (this.newColor.startsWith('rgb')) {
			let color: Array<number> = this.newColor
				.replace('rgb(' || ')', '')
				.split(',')
				.map((x: string) => {
					return parseInt(x, 10);
				});
			this.newColor = this.colorSv.rgbToHex(color[0], color[1], color[2]);
		} else if (this.newColor.startsWith('#')) {
			let color = this.colorSv.hexToRgb(this.newColor);
			this.NewColor = `rgb(${color.r},${color.g},${color.b})`;
		}
	}

	public getHueOfColor(color: string) {
		let hsvColor: Array<number>;
		let colorArr: Array<number>;
		if (color.startsWith('#')) {
			let temp = this.colorSv.hexToRgb(color);
			colorArr = [temp.r, temp.g, temp.b];
		} else if (color.startsWith('rgb')) {
			colorArr = color
				.replace('rgb(', '')
				.split(',')
				.map((x: string) => {
					return parseInt(x, 10);
				});
		}
		hsvColor = this.colorSv.rgbToHsv(colorArr[0], colorArr[1], colorArr[2]);
		this.huePosition = hsvColor[0];
		let templColor = this.colorSv.hsvToRgb(hsvColor[0], 1, 1);
		this.selectedHue = `rgb(${templColor[0]},${templColor[1]},${templColor[2]})`;
	}

	public appendToBody() {
		if (!this.opened) {
			document.body.appendChild(this.element.nativeElement);
		}
	}

	public removeFromBody() {
    this.element.nativeElement.remove();
  }

	public show() {
		this.openPicker = true;
		this.pickerOpened.emit(this.savedColor);
	}

	public hide() {
		if (!this.opened) {
			if (this.gradient) {
				this.left += 13;
			}
			this.openPicker = !this.openPicker;
			this.savedColor = this.NewColor;
			this.pickerClosed.emit(this.NewColor);
		}
	}
	
	cancel() {
		this.pickerClosed.emit(this.savedColor);
		this.openPicker = false;
	}

	saveColor() {
		if (!this.buttons) {
			this.colorSelected.emit({ color: this.NewColor, contrast: this.contrastColor });
		} 
	}

	save() {
		this.colorSelected.emit({ color: this.NewColor, contrast: this.contrastColor });
		this.hide();
	}

	public setColor(color: string) {
		this.transparencyPosition = 1;
		this.NewColor = color;
		this.savedColor = color;
	}

	public setPosition(top: number, left: number) {
		this.top = top;
		this.left = left;
	}

	applyColor(color: string) {
		if (color.startsWith('#') && color.length === 4) {
			let r = color.charAt(1).toString();
			let g = color.charAt(2).toString();
			let b = color.charAt(3).toString();
			this.transparencyPosition = 1;
			this.NewColor = `#${ r }${ r }${ g }${ g }${ b }${ b }`;
		}
	}

	public getPickerStyles(): any {
		return {
			'left': this.left + 'px',
			'top': this.top + 'px',
			'max-height': this.pickerSize + 'px'
		};
	}

	public getCircleStyle(): any {
		return {
			'left': Math.max(Math.round(this.S * 100) - this.circleRadius, -this.circleRadius) + '%',
			'top': Math.max(100 - Math.round(this.V * 100) - this.circleRadius, -this.circleRadius) + '%',
			'border-color': this.contrastColor
		};
	}

	paletteItemClass(item: string) {
		return {
			'active' : item === this.NewColor,
			'black': this.contrastColor === '#000'
		};
	}

	getPickerState(): string {
		return this.openPicker ? 'open' : 'close';
	}

	getAnimationClass() {
		return {
			'close': !this.openPicker,
			'open': this.openPicker
		};
	}
}
