import { head, size, throttle } from 'lodash-es';
import { EMPTY, first, firstValueFrom, map, of, shareReplay, switchMap, withLatestFrom, zip } from 'rxjs';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AlertController, IonActionSheet, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { User } from '@angular/fire/auth';
import { serverTimestamp } from '@angular/fire/firestore';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { Favorite, Product } from '@app/core/model';
import { AuthService, ChattingsService, FavoritesService, ProductsService } from '@app/core/http';
import { SessionService } from '@app/core/session';
import { FsTimestampPipe, LinkifyPipe, ProductConditionPipe, ProductPurchasedPipe } from '@app/shared/pipes';
import { ProductsCommentFormComponent } from '@app/pages/products/products-comment-form/products-comment-form.component';
import { ProductsCommentsComponent } from '@app/pages/products/products-comments/products-comments.component';
import { ProductsEditComponent } from '@app/pages/products/products-edit/products-edit.component';
import { ProductsLightboxComponent } from '@app/pages/products/products-lightbox/products-lightbox.component';
import { ProductChattingComponent } from '@app/pages/products/product-chatting/product-chatting.component';
import { addIcons } from 'ionicons';
import { bookmarkOutline, chatbubbleEllipsesOutline, chatbubblesOutline, ellipsisHorizontal } from 'ionicons/icons';


@Component({
  standalone: true,
  selector: 'app-products-detail',
  imports: [CommonModule, FsTimestampPipe, LinkifyPipe, ProductsCommentsComponent, ProductsCommentFormComponent, ProductsLightboxComponent, ProductConditionPipe, ProductPurchasedPipe, RouterLink, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonContent, IonIcon, IonButton, IonModal, ProductsEditComponent, IonActionSheet],
  providers: [ ActionSheetController, ModalController ],
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsDetailComponent {
  constructor() {
    addIcons({ ellipsisHorizontal, chatbubbleEllipsesOutline, chatbubblesOutline, bookmarkOutline });
  }

  readonly #actionSheetController = inject(ActionSheetController);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #alertController = inject(AlertController);
  readonly #authService = inject(AuthService);
  readonly #chattingService = inject(ChattingsService);
  readonly #elRef = inject(ElementRef);
  readonly #favoritesService = inject(FavoritesService);
  readonly #modalController = inject(ModalController);
  readonly #productsService = inject(ProductsService);
  readonly #router = inject(Router);
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

  favorite$ = this.user$.pipe(
    first(),
    withLatestFrom(this.product$),
    switchMap(([user, product]) => user && product ?
      this.#favoritesService.getProductFavoriteByProfile(product.id, user.uid) :
      of(undefined)
    ),
    shareReplay(1)
  );

  owner$ = zip(this.user$, this.product$).pipe(
    first(),
    map(([user, product]) => user && product && user.uid === product.uid),
    shareReplay(1)
  );

  protected async openUpdateModal() {
    const modal = await this.#modalController.create({
      component: ProductsEditComponent
    });
    await modal.present();
  }

  protected async onClickImage(index: number) {
    const product = await firstValueFrom(this.product$) as Product
    const modal = await this.#modalController.create({
      component: ProductsLightboxComponent,
      componentProps: {
        title: product.name,
        images: product.images,
        selected: index
      },
      cssClass: 'modal'
    });

    await modal.present();
  }

  protected favorite(product: Product) {
    this.#sessionService.userWithGroup$.pipe(
      first(),
      switchMap(({ user, group }) =>
        user && group ?
          this.#favoritesService.addFavorite({
            uid: user.uid,
            groupId: group.id,
            productId: product.id,
            productName: product.name,
            productImage: product.images[0],
          }) :
          of(undefined)
      )
    ).subscribe();
  }

  protected cancelFavorite(favorite: Favorite) {
    this.#favoritesService.deleteFavorite(favorite).then();
  }

  protected async toggleSoldOut() {
    const product = await firstValueFrom(this.product$);
    if (product) {
      await this.#productsService.updateSoldOut(product.id, !product.soldOut);
    }
  }

  protected async onClickChatting(product: Product) {
    const user = await firstValueFrom(this.user$) as User;
    const createdChattingId$ =
      this.#chattingService.getChattingsByProduct(product.id, user.uid).pipe(
        first(),
        map(chattings => head(chattings)?.id)
      );
    const createChatting$ =
      this.#chattingService.createChatting({
        productId: product.id,
        productPhotoURL: head(product.images),
        uids: [user.uid, product.uid],
        created: serverTimestamp()
      });

    const chattingId =
      await firstValueFrom(createdChattingId$) ||
      await createChatting$.then(({ id }) => id);

    const modal = await this.#modalController.create({
      presentingElement: this.#elRef.nativeElement,
      component: ProductChattingComponent,
      componentProps: { chattingId }
    });
    await modal.present();
  }

  protected async delete() {
    const user = await firstValueFrom(this.user$)
    const product = await firstValueFrom(this.product$);

    if (user && product && user.uid === product.uid) {
      const alert = await this.#alertController.create({
        header: '삭제할까요?',
        message: '선택한 물건을 삭제합니다.',
        buttons: [
          {
            text: '취소',
            role: 'cancel'
          },
          {
            text: '삭제',
            role: 'destructive',
            handler: async () => {
              this.product$ = of(product);
              await this.#productsService.deleteProduct(product.id);
              await this.#router.navigateByUrl('/products')
            }
          }
        ],
      });
      await alert.present();
    }
  }

  async onClickMenu() {
    const product = (await firstValueFrom(this.product$)) as Product;
    const actionSheet = await this.#actionSheetController.create({
      header: '세컨드마켓',
      buttons: [
        {
          text: product.soldOut ? '거래중' : '거래완료',
          data: { action: 'toggleSoldOut'},
          handler: this.toggleSoldOut.bind(this)
        },
        {
          text: '수정',
          data: { action: 'update'},
          handler: this.openUpdateModal.bind(this)
        },
        {
          text: '삭제',
          role: 'destructive',
          data: { action: 'delete' },
          handler: this.delete.bind(this),
        },
        {
          text: '취소',
          role: 'cancel',
          data: { action: 'cancel' }
        }
      ]
    });
    await actionSheet.present();
  }

  onClickFavorite2() {
    alert('favorite');
  }

  onClickFavorite = throttle(this.favorite, 3000, { trailing: false });
  onClickCancelFavorite = throttle(this.cancelFavorite, 3000, { trailing: false });
}
