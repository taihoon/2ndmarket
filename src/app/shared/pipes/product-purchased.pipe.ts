import { Pipe, PipeTransform } from '@angular/core';
import { ProductPurchased } from '@app/core/model';


@Pipe({
  standalone: true,
  name: 'productPurchased'
})
export class ProductPurchasedPipe implements PipeTransform {

  transform(purchased: ProductPurchased): string {

    switch (purchased) {
      case ProductPurchased.unknown:
        return '모름';
      case ProductPurchased.week:
        return '일주일 이내';
      case ProductPurchased.month:
        return '한 달 이내';
      case ProductPurchased.threeMonth:
        return '3개월 이내';
      case ProductPurchased.year:
        return '1년 이내';
      case ProductPurchased.longAgo:
        return '오래전';
    }
  }

}
