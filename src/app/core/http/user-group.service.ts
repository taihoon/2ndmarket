import { isEmpty } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import type { NewUserGroup, UserGroup } from '@app/core/model';
import { collection, collectionData, doc, docData, documentId, Firestore, query, setDoc, where } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserGroupService {
  private readonly path = 'userGroups';

  constructor(
    private readonly firestore: Firestore
  ) { }

  setUserGroup(id: string, userInfo: NewUserGroup) {
    return setDoc(
      doc(this.firestore, this.path, id),
      userInfo
    );
  }

  getUserGroupByUid(uid: string) {
    return docData(
      doc(this.firestore, this.path, uid),
      { idField: 'id' }
    )  as Observable<UserGroup | undefined>
  }

  getUserGroupsByUids(uids: string[]) {
    if (isEmpty(uids)) {
      return of([])
    }

    const _query = query(
      collection(this.firestore, this.path),
      where(documentId(), 'in', uids)
    );

    return collectionData(_query, { idField: 'id' }) as Observable<UserGroup[]>;
  }

}
