import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';


@Pipe({
  standalone: true,
  name: 'fsTimestamp'
})
export class FsTimestampPipe implements PipeTransform {

  transform(value: Timestamp) {
    if (value) {
      return value.toDate();
    } else {
      return null;
    }
  }

}
