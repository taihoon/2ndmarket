import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  standalone: true,
  name: 'distanceToNow'
})
export class DistanceToNowPipe implements PipeTransform {
  transform(value: Date | null): string | undefined {
    if (value) {
      return formatDistanceToNow(value, { locale: ko });
    } else {
      return;
    }
  }

}
