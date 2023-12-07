import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { type Verification } from '@app/core/model';
import { deleteDoc, doc, docData, Firestore } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';


@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private readonly path = 'verifications';

  constructor(
    private readonly firestore: Firestore,
    private readonly functions: Functions
  ) { }

  createVerification(groupId: string, email: string) {
    const createVerification = httpsCallable<object, object>(this.functions, 'createVerification');
    return createVerification({ groupId, email });
  }

  getVerification(verificationId: string) {
    return (
      docData(
        doc(this.firestore, this.path, verificationId),
        { idField: 'id' }
      ) as Observable<Verification>
    );
  }

  deleteVerification(verificationId: string) {
    return deleteDoc(
      doc(this.firestore, this.path, verificationId)
    );
  }
}
