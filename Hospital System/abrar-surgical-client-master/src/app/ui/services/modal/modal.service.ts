import {
  ApplicationRef, ComponentFactory,
  ComponentFactoryResolver, ComponentRef,
  Inject,
  Injectable,
  Injector
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { TCModalComponent } from '../../components/modal';
import { IModal } from '../../interfaces/modal';

@Injectable({
  providedIn: 'root'
})
export class TCModalService {
  componentRef: ComponentRef<any>;

  constructor(
    private resolver : ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    @Inject(DOCUMENT) private document: Document
  ) { }

  open(modal: IModal) {
    const FACTORY: ComponentFactory<any> = this.resolver.resolveComponentFactory(TCModalComponent);

    this.componentRef = FACTORY.create(this.injector);

    // add modal @Input parameters
    this.componentRef.instance.body = modal.body;
    this.componentRef.instance.header = modal.header;
    this.componentRef.instance.footer = modal.footer;
    this.componentRef.instance.opened = true;
    this.componentRef.instance.options = modal.options;

    // subscribe @Output close event
    this.componentRef.instance.close.subscribe(data => {
      data ? this.close() : null;
    });

    let { nativeElement } = this.componentRef.location;

    this.componentRef.hostView.detectChanges();
    this.appRef.attachView(this.componentRef.hostView);
    this.document.body.appendChild(nativeElement);
  }

  close() {
    if (this.componentRef) {
      this.componentRef.instance.hideModal();

      setTimeout(() => {
        this.appRef.detachView(this.componentRef.hostView);
        this.componentRef.destroy();
      }, 300);
    }
  }
}
