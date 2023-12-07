import { map,type Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NewProduct, Product, UpdateProduct } from '@app/core/model';
import {
  addDoc, collection, collectionData, deleteDoc,
  doc, docData, Firestore,
  limit,
  orderBy, query, serverTimestamp,
  updateDoc,
  where
} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly path = 'products';

  constructor(
    private readonly firestore: Firestore
  ) {
  }

  addProduct(product: NewProduct) {
    return addDoc(
      collection(this.firestore, this.path),
      product
    );
  }

  updateProduct(productId: string, product: UpdateProduct) {
    return updateDoc(
      doc(this.firestore, `${this.path}/${productId}`),
      product
    )
  }

  getProduct(id: string) {
    return (
      docData(
        doc(this.firestore, this.path, id),
        { idField: 'id' }
      ) as Observable<Product>
    ).pipe(
      map(product => product?.created ? product : undefined)
    );
  }

  getProductsByGroup(
    groupId: string,
    // _startAfter: Timestamp | null = null,
    _limit = 20
  ) {
    const q = query(
      collection(this.firestore, this.path),
      where('groupId', '==', groupId),
      orderBy('updated', 'desc'),
      // startAfter(_startAfter),
      limit(_limit)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>
  }


  getProductsByUser(uid: string, /** _startAfter: Timestamp | null = null, **/ _limit = 20) {
    const _query = query(
      collection(this.firestore, this.path),
      where('uid', '==', uid),
      orderBy('updated', 'desc'),
      // startAfter(_startAfter),
      limit(_limit)
    );
    return collectionData(_query, { idField: 'id' }) as Observable<Product[]>;
  }

  updateSoldOut(productId: string, soldOut: boolean) {
    return updateDoc(
      doc(this.firestore, this.path, productId),
      {
        soldOut: soldOut ? serverTimestamp() : null
      }
    );
  }

  deleteProduct(productId: string) {
    return deleteDoc(
      doc(this.firestore, this.path, productId)
    );
  }

}
