import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SessionService } from '@app/core/session';
import { map, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductsCommentsComponent } from '@app/pages/products/products-comments/products-comments.component';


@Component({
  standalone: true,
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  imports: [CommonModule, ProductsCommentsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestComponent {

  readonly #sessionService = inject(SessionService);
  product$ = this.#sessionService.productsByGroup$.pipe(
    map(products => products.find(product => product.id === 'MgAz64xvjx3crvmypUaa')),
    tap(p => console.log('ppp', p))
  );

  constructor() { }

}
