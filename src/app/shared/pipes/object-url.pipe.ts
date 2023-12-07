import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  standalone: true,
  name: 'objectUrl'
})
export class ObjectUrlPipe implements PipeTransform {
  transform(value: File | Blob | string): string {
    if (typeof value === 'string') {
      return value;
    } else {
      return URL.createObjectURL(value);
    }
  }

}
