import { Pipe, PipeTransform } from '@angular/core';
import type { User } from '@angular/fire/auth'


@Pipe({
  standalone: true,
  name: 'userDisplayName'
})
export class UserDisplayNamePipe implements PipeTransform {

  transform(user: User, size?: number): string {
    const displayName = user.displayName || user.email?.split('@')[0] || 'S';
    if (size !== undefined && size > 0) {
      return displayName.slice(0, size).toUpperCase();
    } else {
      return displayName
    }
  }

}
