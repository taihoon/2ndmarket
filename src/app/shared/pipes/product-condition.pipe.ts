import { Pipe, PipeTransform } from '@angular/core';
import { ProductCondition } from '@app/core/model';


@Pipe({
  standalone: true,
  name: 'productCondition'
})
export class ProductConditionPipe implements PipeTransform {

  transform(condition: ProductCondition): string {
    switch (condition) {
      case ProductCondition.boxed:
        return '미개봉';
      case ProductCondition.almostNew:
        return '거의 새 상품';
      case ProductCondition.used:
        return '사용감 있음';
    }
  }

}
