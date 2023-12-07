import { isEmpty } from 'lodash-es';
import { map, type Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { type Group } from '@app/core/model';
import { collection, collectionData, doc, docData,   documentId, Firestore, query, where, } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private readonly path = 'groups';

  constructor(
    private readonly firestore: Firestore,
  ) {
  }

  getGroup(groupId: string) {
    return docData(
      doc(this.firestore, this.path, groupId),
      { idField: 'id'}
    ) as Observable<Group | undefined>
  }

  getGroupsByIds(ids: string[]) {
    if (isEmpty(ids)) {
      return of([])
    }
    const _query = query(
      collection(this.firestore, this.path),
      where(documentId(), 'in', ids)
    );

    return collectionData(_query, { idField: 'id' }) as Observable<Group[]>
  }

  getGroups() {
    return (
      collectionData(
        collection(this.firestore, this.path),
        {idField: 'id'}
      ) as Observable<Group[]>
    ).pipe(
      map(groups => groups.sort((a, b) => a.name.localeCompare(b.name))),
      map(groups => groups.map(group => ({...group, domains: group.domains.sort()} as Group)))
    );
  }

}
