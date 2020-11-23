import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minusSignToParens'
})
@Injectable()
export class MinusSign implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.charAt(0) === '-' ?
           value.substring(1, value.length) :
           value;
}

}