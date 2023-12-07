import { FieldValue,Timestamp } from '@angular/fire/firestore';


export type Message = {
  id: string;
  uid: string;
  body: string;
  created: Timestamp;
}

export type Chatting = {
  id: string;
  uids: string[],
  productId: string; // Product ID
  productPhotoURL: string | undefined,
  latest: string; // latest message;
  // messages: CollectionReference<Message>;
  updated: Timestamp;
  created: Timestamp;
}

export type NewMessage = Omit<Message, 'id' | 'created'> & {
  created: FieldValue;
}

export type NewChatting = Omit<Chatting, 'id' | 'latest' | 'created' | 'updated'> & {
  created: FieldValue;
}
