import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonImg, IonRippleEffect } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DistanceToNowPipe, FsTimestampPipe, ProductConditionPipe, ProductPurchasedPipe } from '@app/shared/pipes';
import { addIcons } from 'ionicons';
import { bookmarkOutline, chatbubbleEllipsesOutline } from 'ionicons/icons';
import { Product } from '@app/core/model';


@Component({
  standalone: true,
  selector: 'app-products-item',
  imports: [CommonModule, FsTimestampPipe, DistanceToNowPipe, ProductConditionPipe, ProductPurchasedPipe, RouterLink, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonImg, NgOptimizedImage, IonIcon, IonRippleEffect],
  templateUrl: './products-item.component.html',
  styleUrls: ['./products-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsItemComponent {
  @Input() product!: Product;

  constructor() {
    addIcons({ chatbubbleEllipsesOutline, bookmarkOutline });
  }

}
