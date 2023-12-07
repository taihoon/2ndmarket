import { Injectable } from '@angular/core';
import {
  collection, collectionData,
  Firestore,
orderBy,
  query, where} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class _MessagesService {
  private readonly path = 'messages';

  constructor(
    private readonly firestore: Firestore
  ) {
  }

  getMessages({ groupId, profileId }: { groupId: string, profileId: string }) {
    const _query = query(
      collection(this.firestore, this.path),
      where('groupId', '==', groupId),
      where('profileId', '==', profileId),
      orderBy('created', 'desc')
    );

    return collectionData(_query, { idField: 'id' });
  }
}
