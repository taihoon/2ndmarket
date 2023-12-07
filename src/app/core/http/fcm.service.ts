import { EMPTY, from, type Observable, shareReplay, tap } from 'rxjs';
import { Injectable, Optional } from '@angular/core';
import { getToken, Messaging } from '@angular/fire/messaging';
import { environment } from '@environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FcmService {
  token$: Observable<string> = EMPTY;

  constructor(@Optional() messaging: Messaging) {
    // console.log('messaging', messaging);
    // from(
    //   navigator.serviceWorker.register(
    //     'firebase-messaging-sw.js',
    //     { type: 'module', scope: '__' }
    //   ).then(
    //     serviceWorkerRegistration => {
    //       return getToken(
    //         messaging,
    //         {
    //           serviceWorkerRegistration,
    //           vapidKey: environment.vapidKey
    //         }
    //       );
    //     }
    //   )
    // ).pipe(
    //   tap(token => console.log('FCM', { token })),
    //   shareReplay(1)
    // );
  }
}
