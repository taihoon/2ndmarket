import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AbstractControl } from '@angular/forms';


@Directive({
  standalone: true,
  selector: '[appValueToDecimal]'
})
export class ValueToDecimalDirective implements OnInit {
  @Input() appValueToDecimal!: AbstractControl;
  // protected target!: HTMLInputElement;

  constructor(
    private el: ElementRef,
    private decimalPipe: DecimalPipe,
  ) {
  }

  ngOnInit() {
    if (this.appValueToDecimal.value) {
      this.el.nativeElement.value = this.transformDecimal(this.appValueToDecimal.value);
    }
  }

  transformDecimal(price: number) {
    return this.decimalPipe.transform(price, '1.0-0') || '';
  }

  @HostListener('input', ['$event']) onInput() {
    const target = this.el.nativeElement;
    const parsedPrice = parseInt(target.value.replace(/,/g, ''), 10) || 0;
    const decimalPrice = this.transformDecimal(parsedPrice);
    if (decimalPrice) {
      target.value = decimalPrice;
      this.appValueToDecimal.setValue(parsedPrice);
    } else {
      this.appValueToDecimal.setValue(null);
    }
    this.appValueToDecimal.markAsDirty();
  }

}
