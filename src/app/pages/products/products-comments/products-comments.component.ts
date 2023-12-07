import { last, unionBy } from 'lodash-es';
import { filter, map, of, shareReplay, switchMap } from 'rxjs';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import type { Comment,Product } from '@app/core/model';
import { CommentsService } from '@app/core/http';
import { SessionService } from '@app/core/session';
import { FsTimestampPipe } from '@app/shared/pipes';
import { user } from '@angular/fire/auth';


@Component({
  standalone: true,
  selector: 'app-products-comments',
  imports: [ CommonModule, DatePipe, FsTimestampPipe ],
  templateUrl: './products-comments.component.html',
  styleUrls: ['./products-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsCommentsComponent {
  @Input() product!: Product;
  user$ = this.sessionService.user$;

  private comments$ = this.activatedRoute.paramMap.pipe(
    map(m => m.get('productId')),
    switchMap(productId =>
      productId ?
        this.commentsService.getCommentsByProduct(productId) :
        of([])
    ),
    shareReplay(1)
  );

  commentsByProfile$ = this.comments$.pipe(
    map(comments => comments.reduce(
      (a: Comment[][], c, i, o) => {
        c.uid !== o[i - 1]?.uid ?
          a.push([c]) :
          last(a)?.push(c);
        return a;
      }
    , []))
  );

  commentUserCount$ = this.comments$.pipe(
    map(comments => unionBy(comments, 'profileId').length)
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private commentsService: CommentsService,
    private sessionService: SessionService
  ) {
  }

  onDelete(comment: Comment) {
    this.user$.pipe(
      filter(user => comment.uid === user?.uid),
      filter(() => confirm(comment.body + '를 삭제할까요?')),
      switchMap(() => this.commentsService.delete(comment))
    ).subscribe()
  }

  trackByIndex(index: number) {
    return index;
  }

  trackById(index: number, item: Comment) {
    return item.id;
  }

}
