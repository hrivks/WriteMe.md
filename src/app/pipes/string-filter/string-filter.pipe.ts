import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringFilter'
})
export class StringFilterPipe implements PipeTransform {

  transform(items: string[], filter?: string, key?: string): string[] {
    if (!items || !filter) {
      return items;
    } else {
      filter = filter.toLowerCase();
      let filteredItems = [];
      if (key) {
        filteredItems = items.filter((i) => i[key].toLowerCase().indexOf(filter) > -1);
      } else {
        filteredItems = items.filter((i) => i.toLowerCase().indexOf(filter) > -1);
      }


      return filteredItems;
    }

  }

}
