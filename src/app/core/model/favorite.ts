import { FieldValue,Timestamp } from '@angular/fire/firestore';


export interface Favorite {
  id: string;
  uid: string;
  groupId: string;
  productId: string,
  productName: string,
  productImage: string
  created: Timestamp;
}

export type NewFavorite = Omit<Favorite, 'id' | 'created'> & { created?: FieldValue};
