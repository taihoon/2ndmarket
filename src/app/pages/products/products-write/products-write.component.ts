import { sumBy } from 'lodash-es';
import { delay, map, of, scan, Subject, switchMap, withLatestFrom } from 'rxjs';
import { IonBackButton, IonBackdrop, IonButton, IonButtons, IonContent, IonHeader, IonProgressBar, IonSpinner, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { type User } from '@angular/fire/auth';
import { serverTimestamp } from '@angular/fire/firestore';
import { type Group, type NewProduct, ProductCondition, type ProductFormData, ProductPurchased, ProductShipping } from '@app/core/model';
import { CloudinaryService, ProductsService } from '@app/core/http';
import { SessionService } from '@app/core/session';
import { ProductsFormComponent } from '@app/pages/products/products-form/products-form.component';
import { faker } from '@faker-js/faker';


@Component({
  standalone: true,
  selector: 'app-products-write',
  imports: [CommonModule, ProductsFormComponent, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonContent, IonButton, IonBackdrop, IonProgressBar, IonSpinner],
  providers: [DecimalPipe],
  templateUrl: './products-write.component.html',
  styleUrls: ['./products-write.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsWriteComponent {
  readonly #cloudinaryService = inject(CloudinaryService);
  readonly #modalController = inject(ModalController);
  readonly #productsService = inject(ProductsService);
  readonly #sessionService = inject(SessionService);

  @ViewChild(ProductsFormComponent) productFormComponent!: ProductsFormComponent;

  submitting = false;
  uploaded$ = new Subject<number>();

  productFormData$ = of({
    product: {
      condition: ProductCondition.boxed,
      contact: faker.phone.number(),
      memo: faker.commerce.productDescription(),
      name: faker.commerce.productAdjective() + ' ' + faker.commerce.product(),
      price: faker.number.int({max: 900000}),
      purchased: ProductPurchased.month,
      shipping: ProductShipping.directly
    } as ProductFormData,
    images: [] as string[] // images
  });

  onClickCancel() {
    this.#modalController.dismiss(null, 'cancel').then();
  }

  onClickConfirm() {
    if (!this.productFormComponent.valid) {
      return;
    }

    this.submitting = true;
    const formValue = this.productFormComponent.formValue;
    const images = this.productFormComponent.attachedImages;
    const blobs = images.filter(i => i instanceof Blob) as Blob[];
    const totalSize = sumBy(blobs, b => b.size) * 1.4;

    const [
      uploadProgress$,
      uploadComplete$
    ] = this.#cloudinaryService.upload(images, 't_product');

    uploadProgress$.pipe(
      scan((loaded, e) => loaded + e.loaded, 0)
    ).subscribe({
      next: (loaded) => {
        this.uploaded$.next(loaded / totalSize);
      },
      complete: () => {
        this.uploaded$.next(1);
        this.uploaded$.complete()
      }
    });

    uploadComplete$.pipe(
      withLatestFrom(this.#sessionService.userWithGroup$),
      map(([images, userWithGroup]) => {
        const {user, group} = userWithGroup as { user: User, group: Group };
        return {
          ...formValue,
          images,
          uid: user.uid,
          groupId: group.id,
          userDisplayName: user.displayName,
          userPhotoURL: user.photoURL,
          favoritesCnt: 0,
          commentsCnt: 0,
          updatedCnt: 0,
          soldOut: null,
          created: serverTimestamp(),
          updated: serverTimestamp()
        } as NewProduct;
      }),
      switchMap(product =>
        this.#productsService.addProduct(product)
      ),
      delay(1500)
    ).subscribe(product => {
      this.submitting = false;
      this.#modalController.dismiss(null, 'confirm');
    });
  }
}
