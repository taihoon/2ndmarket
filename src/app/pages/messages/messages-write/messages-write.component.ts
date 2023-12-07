import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@app/core/model';
import { SessionService } from '@app/core/session';
import { ProductsCommentFormComponent } from '@app/pages/products/products-comment-form/products-comment-form.component';
import { ProductsCommentsComponent } from '@app/pages/products/products-comments/products-comments.component';


@Component({
  standalone: true,
  selector: 'app-messages-write',
  templateUrl: './messages-write.component.html',
  styleUrls: ['./messages-write.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, ProductsCommentFormComponent, ProductsCommentsComponent ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesWriteComponent {
  @Input() product!: Product
  readonly #sessionService = inject(SessionService);

  constructor() {
    console.log('product', this.product);
    console.log('session', this.#sessionService.user$);
  }

}
