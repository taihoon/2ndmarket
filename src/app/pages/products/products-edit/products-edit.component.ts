import { pick, sumBy } from 'lodash-es';
import { delay, first, map, of, scan, shareReplay, Subject, switchMap, tap, withLatestFrom } from 'rxjs';
import { IonBackdrop, IonButton, IonButtons, IonContent, IonHeader, IonProgressBar, IonSpinner, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import type { Product, ProductFormData } from '@app/core/model';
import { CloudinaryService, ProductsService } from '@app/core/http';
import { ProductsFormComponent } from '@app/pages/products/products-form/products-form.component';


@Component({
  standalone: true,
  selector: 'app-products-edit',
  imports: [CommonModule, ProductsFormComponent, IonButton, IonButtons, IonContent, IonHeader, IonProgressBar, IonTitle, IonToolbar, IonBackdrop, IonSpinner],
  providers: [ DecimalPipe ],
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsEditComponent {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #modalController = inject(ModalController);
  readonly #cloudinaryService = inject(CloudinaryService);
  readonly #productsService = inject(ProductsService);

  @ViewChild(ProductsFormComponent) productFormComponent!: ProductsFormComponent;

  submitting = false;
  uploaded$ = new Subject<number>();

  product$ = this.#activatedRoute.paramMap.pipe(
    map(map => map.get('productId')),
    switchMap(productId =>
      productId ?
        this.#productsService.getProduct(productId) :
        of(undefined)
    ),
    shareReplay(1)
  );

  productFormData$ = this.product$.pipe(
    map(product => product ?
      {
        product: pick(
          product,
          ['name', 'purchased', 'condition', 'price', 'shipping', 'contact', 'memo']
        ) as ProductFormData,
        images: product.images
      } :
      undefined
    )
  );

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

    (
      blobs.length > 0 ?
        uploadComplete$ :
        of(images)
    ).pipe(
      withLatestFrom(this.product$.pipe(first())),
      map(([ images, product ]) => {
        return {
          ...product,
          ...formValue,
          images
        } as Product;
      }),
      switchMap(product =>
        this.#productsService.updateProduct(product.id, product)
      ),
      delay(1500)
    ).subscribe(product => {
      this.submitting = false;
      this.#modalController.dismiss(null, 'confirm').then();
    });
  }

}
