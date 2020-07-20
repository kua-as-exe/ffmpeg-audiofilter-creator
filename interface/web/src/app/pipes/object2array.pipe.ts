import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'object2array'
})
export class Object2arrayPipe implements PipeTransform {

  transform(obj: object, separator: string = ': '): any[] {
    let out = []
    Object.keys(obj).forEach( key => {
      out.push( key+ separator + obj[key])
    })
    console.log(out);
    return out;
  }

}
