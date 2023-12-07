import { type Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Comment, NewComment } from '@app/core/model';
import { collection, collectionData, doc, Firestore, increment, orderBy, query, runTransaction, serverTimestamp, where} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly path = 'comments';

  constructor(
    private readonly firestore: Firestore,
  ) {
  }

  async addComment(comment: NewComment) {
    return runTransaction(
      this.firestore,
      async transaction => {
        transaction.set(
          doc(collection(this.firestore, this.path)),
          { ...comment, created: serverTimestamp() }
        );
        transaction.update(
          doc(this.firestore, 'products', comment.productId),
          { commentsCnt: increment(1)}
        );
      }
    );
  }

  getCommentsByProduct(productId: string) {
    const _query = query(
      collection(this.firestore, this.path),
      where('productId', '==', productId),
      orderBy('created', 'asc')
    );

    return collectionData(_query, { idField: 'id' }) as Observable<Comment[]>
  }

  async delete(comment: Comment) {
    return runTransaction(
      this.firestore,
      async transaction => {
        transaction.delete(
          doc(this.firestore, this.path, comment.id)
        );
        transaction.update(
          doc(this.firestore, 'products', comment.productId),
          {commentsCnt: increment(-1)}
        );
      }
    );
  }

}
