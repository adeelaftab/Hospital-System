import { TemplateRef, Type } from '@angular/core';

export interface IModal {
  body: Tpl;
  header?: Tpl;
  footer?: Tpl;
  options?: IModalOptions;
}

export interface IModalOptions {
  height: number | string;
  width: number | string;
  closeButton: boolean;
  overlay: boolean;
  overlayClose: boolean;
}

type Tpl = string | TemplateRef<any> | Type<any>;
export type Content<T> = string | TemplateRef<T> | Type<T>;
