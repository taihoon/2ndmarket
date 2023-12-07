import { head } from 'lodash-es';
import { map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { addDoc, getCountFromServer, collection, collectionData, deleteDoc, doc, docData, Firestore, limit, orderBy, query, serverTimestamp, updateDoc, where } from '@angular/fire/firestore';
import { Chatting, Message, NewChatting, NewMessage } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class ChattingsService {
  readonly #path = 'chattings';
  readonly #firestore = inject(Firestore);

  constructor() { }

  createChatting(chatting: NewChatting) {
    return addDoc(
      collection(this.#firestore, this.#path),
      chatting
    );
  }

  getChatting(chattingId: string) {
    return docData(
      doc(this.#firestore, this.#path, chattingId),
      { idField: 'id' }
    ) as Observable<Chatting>;
  }

  getChattingsByProduct(productId: string, uid: string) {
    const _query = query(
      collection(this.#firestore, this.#path),
      where('productId', '==', productId),
      where('uids', 'array-contains', uid),
      orderBy('updated', 'desc')
    );

    return collectionData(_query, { idField: 'id' }) as Observable<Chatting[]>;
  }

  getChattings(uid: string) {
    const _query = query(
      collection(this.#firestore, this.#path),
      where('uids', 'array-contains', uid),
      orderBy('updated', 'desc')
    );
    return collectionData(_query, { idField: 'id' }) as Observable<Chatting[]>;
  }

  getMessages(chattingId: string) {
    const _query = query(
      collection(this.#firestore, this.#path, chattingId, 'messages'),
      orderBy('created', 'asc')
    );

    return collectionData(_query, { idField: 'id' }) as Observable<Message[]>;
  }

  async addMessage(chatId: string, message: NewMessage) {
    await updateDoc(
      doc(this.#firestore, this.#path, chatId),
      { latest: message.body, updated: serverTimestamp() }
    );

    return await addDoc(
      collection(this.#firestore, this.#path, chatId, 'messages'),
      message
    );
  }

  removeMessage(chatId: string, messageId: string) {
    return deleteDoc(
      doc(this.#firestore, this.#path, chatId, 'messages', messageId)
    )

  }


}
