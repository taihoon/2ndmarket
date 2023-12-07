import { FieldValue, Timestamp } from '@angular/fire/firestore';


export interface _Message {
  id: string;
  profileId: string;
  contents: {
    type: string,
    id: string
  },
  sender: {
    id: string,
    displayName: string
  },
  title: string,
  body: string,
  image: string,
  link: string;
  read: boolean;
  created: Timestamp
}

export type _NewMessage = Omit<_Message, 'id' | 'created'> & {
  created: FieldValue;
};
