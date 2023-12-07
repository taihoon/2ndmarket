import { combineLatest, EMPTY, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { IonAvatar, IonBackButton, IonBadge, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonNote, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Chatting } from '@app/core/model';
import { AuthService, ChattingsService, ProductsService } from '@app/core/http';
import { SessionService } from '@app/core/session';
import { DistanceToNowPipe, FsTimestampPipe } from '@app/shared/pipes';
import { ProductChattingComponent } from '@app/pages/products/product-chatting/product-chatting.component';


@Component({
  standalone: true,
  selector: 'app-product-chattings',
  templateUrl: './product-chattings.component.html',
  styleUrls: ['./product-chattings.component.scss'],
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent,
    IonList,
    AsyncPipe,
    IonItem,
    IonLabel,
    IonAvatar,
    IonThumbnail,
    IonText,
    IonNote,
    IonIcon,
    DatePipe,
    FsTimestampPipe,
    DistanceToNowPipe,
    IonBadge,
    IonBackButton,
    IonButtons
  ],
  providers: [ ModalController ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductChattingsComponent {
  readonly #authService = inject(AuthService);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #chattingService = inject(ChattingsService);
  readonly #elRef = inject(ElementRef);
  readonly #modalController = inject(ModalController);
  readonly #productsService = inject(ProductsService);
  readonly #sessionService = inject(SessionService);

  user$ = this.#authService.user$;

  product$ = this.#activatedRoute.paramMap.pipe(
    map(m => m.get('productId')),
    switchMap(productId => productId ?
      this.#sessionService.productsByGroup$.pipe(
        map(products => products.find(p => p.id === productId)),
        switchMap(product => product ?
          of(product) :
          this.#productsService.getProduct(productId)
        )
      ) :
      EMPTY
    ),
    shareReplay(1)
  );

  chattings$ = combineLatest([
    this.user$,
    this.product$
  ]).pipe(
    switchMap(([user, product]) => user && product ?
      this.#chattingService.getChattingsByProduct(product.id, user.uid) :
      of([])
    )
  );

  async onClickChatting(chatting: Chatting) {

    const modal = await this.#modalController.create({
      presentingElement: this.#elRef.nativeElement,
      component: ProductChattingComponent,
      componentProps: { chattingId: chatting.id }
    });
    await modal.present();
  }
}
