import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minus'
})
@Injectable()
export class MinSign implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.charAt(0) === '-' ?
           value.substring(1, value.length) :
           value;
}

}