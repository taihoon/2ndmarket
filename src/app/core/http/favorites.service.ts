import { head } from 'lodash-es';
import { map, type Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Favorite, NewFavorite } from '@app/core/model';
import { collection, collectionData, doc, Firestore, increment, query, runTransaction, serverTimestamp, where} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly path = 'favorites';

  constructor(
    private readonly firestore: Firestore,
  ) {
  }

  async addFavorite(favorite: NewFavorite) {
    return runTransaction(
      this.firestore,
      async transaction => {
        transaction.update(
          doc(this.firestore, 'products', favorite.productId),
          { favoritesCnt: increment(1)}
        );
        transaction.set(
          doc(collection(this.firestore, this.path)),
          { ...favorite, created: serverTimestamp() }
        );
      }
    );
  }

  getFavoritesByUid(uid: string) {
    const q = query(
      collection(this.firestore, this.path),
      where('uid', '==', uid)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Favorite[]>
  }

  getProductFavoriteByProfile(productId: string, profileId: string) {
    const q = query(
      collection(this.firestore, this.path),
      where('profileId', '==', profileId),
      where('product.id', '==', productId)
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map(favorites => head(favorites))
    ) as Observable<Favorite | undefined>;
  }

  deleteFavorite(favorite: Favorite) {
    return runTransaction(
      this.firestore,
      async transaction => {
        transaction.update(
          doc(this.firestore, 'products', favorite.productId),
          {favoritesCnt: increment(-1)}
        );
        transaction.delete(
          doc(this.firestore, this.path, favorite.id)
        );
      }
    )
  }

}
