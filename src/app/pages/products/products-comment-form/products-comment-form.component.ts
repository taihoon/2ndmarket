import { firstValueFrom } from 'rxjs';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NewComment,Product } from '@app/core/model';
import { AuthService, CommentsService } from '@app/core/http';
import { SessionService } from '@app/core/session';


@Component({
  standalone: true,
  selector: 'app-products-comment-form',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './products-comment-form.component.html',
  styleUrls: ['./products-comment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsCommentFormComponent {
  @Input() product!: Product;

  commentForm = new FormGroup({
    body: new FormControl('', { nonNullable: true })
  });

  get body() {
    return this.commentForm.controls.body;
  }

  constructor(
    private readonly authService: AuthService,
    private readonly commentsService: CommentsService,
    private readonly sessionService: SessionService,
  ) { }

  async onSubmit() {
    const formValue = this.commentForm.value;
    this.commentForm.reset();

    const { user, group } = await firstValueFrom(
      this.sessionService.userWithGroup$
    );

    if (!user || !group) {
      return
    }

    const comment = {
      uid: user.uid,
      groupId: group.id,
      productId: this.product.id,
      userPhotoURL: user.photoURL,
      userDisplayName: user.displayName,
      ...formValue
    } as NewComment;

    this.commentsService.addComment(comment).then();
  }

}
