import { FieldValue, Timestamp } from '@angular/fire/firestore'


export interface Verification {
  id: string;
  groupId: string;
  email: string;
  code: string;
  secret: string;
  created: Timestamp;
}

export type NewVerification = Omit<Verification, 'id' | 'created'> & {
  created?: FieldValue;
}
