import { FieldValue, Timestamp } from '@angular/fire/firestore'


export enum GroupType {
  corp = 'corp',
  school = 'school',
  apt = 'apt'
}

export interface Group {
  id: string;
  domains: [string];
  name: string;
  type: GroupType;
  created: Timestamp;
}

export type NewGroup = Omit<Group, 'id'> & {
  created: FieldValue
}
