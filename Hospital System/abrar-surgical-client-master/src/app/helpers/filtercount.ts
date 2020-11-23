import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filtercount'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
searchText = searchText.toLowerCase();
return items.filter( it => {
      return it.name.toLowerCase().includes(searchText);
    }).reduce((a, b) => a.total + b.total, 0);
   }
}