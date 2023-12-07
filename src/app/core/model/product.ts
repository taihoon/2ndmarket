import { FieldValue, Timestamp } from '@angular/fire/firestore'

/*
 * deprecated
 */
export enum ProductCategory {
  appliances = 'appliances',  // 가전제품, 디지털
  household = 'household',    // 생활용품
  beauty = 'beauty',          // 뷰티
  home = 'home',              // 홈데코
  women = 'women',            // 여성의류
  man = 'man',                // 남성의류
  fashion = 'fashion',        // 패션잡화
  luxury = 'luxury',          // 명품, 주얼리
  kids = 'kids'               // 유아, 출산
}

export enum ProductDeal {
  sale = 'sale',              // 판매
  purchase = 'purchase'       // 구매
}

export enum ProductPurchased {
  unknown = 'unknown',        // 알 수 없음
  week = 'week',              // 일주일 이내
  month = 'month',            // 한 달 이내
  threeMonth = 'threeMonth',  // 석 달 이내
  year = 'year',              // 일 년 이내
  longAgo = 'longAgo'         // 오래전
}

export enum ProductCondition {
  boxed = 'boxed',            // 미개봉
  almostNew = 'almostNew',    // 거의 새상품
  used = 'used'               // 사용감 있음
}

export enum ProductShipping {
  directly = 'directly',      // 직거래
  delivery = 'delivery',      // 택배
  etc = 'etc'                 // 기타 다른 방법
}

export interface Product {
  id: string;
  uid: string;
  groupId: string;
  userDisplayName: string,
  userPhotoURL: string,
  name: string;
  shared: boolean;
  // deal: ProductDeal;
  purchased: ProductPurchased;
  condition: ProductCondition;
  price: number;
  shipping: ProductShipping;
  images: string/*url*/[];
  contact: string;
  memo: string;
  favoritesCnt: number;
  commentsCnt: number;
  updatedCnt: number;
  soldOut: Timestamp | null;
  created: Timestamp;
  updated: Timestamp;
}

export type NewProduct = Omit<Product, 'id' | 'created' | 'updated'> & {
  created: FieldValue;
  updated: FieldValue;
};

export type UpdateProduct = Omit<Partial<Product>, 'id' | 'updated'> & {
  updated: FieldValue;
};

export type ProductFormData = {
  condition: ProductCondition | undefined,
  contact: string | undefined,
  memo: string | undefined
  name: string | undefined,
  price: number | undefined,
  purchased: ProductPurchased | undefined,
  shipping: ProductShipping | undefined
};
