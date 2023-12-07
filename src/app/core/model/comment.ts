import { FieldValue,Timestamp } from '@angular/fire/firestore';


export interface Comment {
  id: string;
  uid: string;
  groupId: string;
  productId: string;
  body: string;
  userPhotoURL: string,
  userDisplayName: string
  created: Timestamp;
}

export type NewComment = Omit<Comment, 'id' | 'created'> & {
  created?: FieldValue;
};
