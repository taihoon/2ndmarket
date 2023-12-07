import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { type ProductFormData } from '@app/core/model';
import { ValueToDecimalDirective } from '@app/shared/directives'
import { ImagesControlComponent } from '@app/shared/components';


@Component({
  standalone: true,
  selector: 'app-products-form',
  imports: [CommonModule, ImagesControlComponent, ReactiveFormsModule, ValueToDecimalDirective, IonBackButton, IonButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonContent],
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsFormComponent implements OnInit {
  readonly maxImageCount = 10;
  productForm!: FormGroup;

  @Input({ required: true }) product!: ProductFormData;
  @Input({ required: true }) images!: string[];
  @ViewChild(ImagesControlComponent) imagesControlComponent!: ImagesControlComponent;

  get name() { return this.productForm.controls['name'] }
  get purchased() { return this.productForm.controls['purchased'] }
  get condition() { return this.productForm.controls['condition'] }
  get price() { return this.productForm.controls['price'] }
  get shipping() { return this.productForm.controls['shipping'] }
  get contact() { return this.productForm.controls['contact'] }
  get memo() { return this.productForm.controls['memo'] }

  get valid() { return this.productForm.valid && this.imagesControlComponent.images.length > 0 }
  get formValue() { return this.productForm.value as ProductFormData };
  get attachedImages() { return this.imagesControlComponent.images }

  ngOnInit(): void {
    this.productForm = new FormBuilder().nonNullable.group(this.product);
  }

}
