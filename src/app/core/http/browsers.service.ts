import { map, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { arrayUnion, collection, doc, docData, Firestore, setDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class BrowsersService {
  private readonly path = 'browsers'

  constructor(
    private readonly firestore: Firestore
  ) {
    if (!this.getBrowserId()) {
      this.setBrowserId();
    }
  }

  getBrowserId() {
    return localStorage.getItem('__c');
  }

  private setBrowserId() {
    const key = doc(collection(this.firestore, this.path)).id;
    localStorage.setItem('__c', key);
  }

  setBrowserUser(uid: string) {
    const browserId = this.getBrowserId();
    if (browserId) {
      return setDoc(
        doc(this.firestore, this.path, browserId),
        {
          users: arrayUnion(uid)
        },
        { merge: true }
      );
    } else {
      alert('!browser id');
      return Promise.reject();
    }
  }

  getBrowserUser() {
    const browserId = this.getBrowserId();
    if (browserId) {
      return docData(
        doc(this.firestore, this.path, browserId)
      ).pipe(
        map(data => data?.['users'])
      ) as Observable<string[] | undefined>;
    } else {
      return of(undefined);
    }
  }

}
