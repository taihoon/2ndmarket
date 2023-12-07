import { IonContent, IonHeader, IonItem, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '@app/core/session';
import { ProductsItemComponent } from '../products-item/products-item.component';

@Component({
  standalone: true,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonContent, IonTitle, ProductsItemComponent, IonList, IonItem],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent {
  readonly #sessionService = inject(SessionService);
  readonly group$ = this.#sessionService.group$;
  readonly products$ = this.#sessionService.productsByGroup$;

  constructor() { }

}
