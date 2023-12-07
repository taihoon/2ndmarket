import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  standalone: true,
  name: 'msToMMSS'
})
export class MsToMMSSPipe implements PipeTransform {

  transform(value: number): string {
    const seconds = Math.floor((value / 1000) % 60);
    const minutes = Math.floor((value / (60 * 1000)) % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

}
