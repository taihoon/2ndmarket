import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class BackdropService {
  backdrop$ = new Subject<{ visible: boolean, message?: string }>();

  show(message = '') {
    this.backdrop$.next({ visible: true, message });
  }

  hide() {
    this.backdrop$.next({ visible: false });
  }

}
