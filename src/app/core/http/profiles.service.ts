// import { head, isEmpty } from 'lodash-es';
// import { map, of, switchMap, type Observable, shareReplay, tap } from 'rxjs';
// import { Injectable } from '@angular/core';
// import {
//   Firestore,
//   addDoc, doc, updateDoc, docData,
//   collection, collectionData,
//   query, where, serverTimestamp, arrayUnion, setDoc, documentId
// } from '@angular/fire/firestore'
// import { AuthService } from '@app/core/http';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class _ProfilesService {
//   private readonly path = 'profiles';
//
//   constructor(
//     private readonly firestore: Firestore,
//     private readonly authService: AuthService
//   ) { }
//
//   getProfileByUid(uid: string) {
//     const _query = query(
//       collection(this.firestore, this.path),
//       where('uid', '==', uid)
//     );
//     return collectionData(
//       _query,
//       { idField: 'id' }
//     ).pipe(
//       map(data => head(data))
//     ) as Observable<Profile | undefined>
//   }
//
//   getProfilesByIds(ids: string[]) {
//     if (isEmpty(ids)) {
//       return of([]);
//     }
//     const _query = query(
//       collection(this.firestore, this.path),
//       where(documentId(), 'in', ids)
//     );
//     return collectionData(_query, { idField: 'id' }) as Observable<Profile[]>
//   }
//
//   getProfileByGroupIdAndEmail(groupId: string, email: string) {
//     const _query = query(
//       collection(this.firestore, this.path),
//       where('groupId', '==', groupId),
//       where('email', '==', email)
//     );
//
//     return collectionData(_query, { idField: 'id' })
//       .pipe(
//         map(data => head(data))
//       ) as Observable<Profile | undefined>
//   }
//
//   setProfile(profileId: string, profile: NewProfile) {
//     return setDoc(
//       doc(this.firestore, this.path, profileId),
//       { ...profile, created: serverTimestamp() }
//     )
//   }
//
//
//   updateProfile(profileId: string, { displayName, photoURL }: { [key: string]: string }) {
//     return updateDoc(
//       doc(this.firestore, this.path, profileId),
//       { displayName, photoURL }
//     );
//   }
//
// }
