import { Directive, HostBinding, Input } from '@angular/core';
import { align } from '../../interfaces/general';

@Directive({
  selector: '[tcAlign]'
})
export class TCAlignDirective {
  @Input() tcAlign: align;
  @HostBinding('class.left-align') get leftAlign() { return this.tcAlign === align.left };
  @HostBinding('class.center-align') get centerAlign() { return this.tcAlign === align.center };
  @HostBinding('class.right-align') get rightAlign() { return this.tcAlign === align.right };
}
