import { of, switchMap } from 'rxjs';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { type Product } from '@app/core/model';
import { ProductsService } from '@app/core/http';
import { SessionService } from '@app/core/session';


@Component({
  standalone: true,
  selector: 'app-preference-products',
  imports: [CommonModule, RouterLink, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonContent],
  templateUrl: './preference-products.component.html',
  styleUrls: ['./preference-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferenceProductsComponent {
  private readonly  productService = inject(ProductsService);
  user$ = inject(SessionService).user$;

  products$ = this.user$.pipe(
    switchMap(user =>
      user ?
        this.productService.getProductsByUser(user.uid) :
        of([])
    )
  );

  trackById(index: number, product: Product) {
    return product.id;
  }
}
