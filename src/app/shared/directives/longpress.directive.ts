import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';


@Directive({
  standalone: true,
  selector: '[appLongpress]'
})
export class LongpressDirective {
  @Output() longpress = new EventEmitter();
  private timerId!: number;

  constructor(
    private elementRef: ElementRef
  ) { }

  @HostListener('click', ['$event'])
  handleClickStart() {
    if (!navigator.maxTouchPoints) {
      this.longpress.emit();
    }
  }

  @HostListener('touchstart', ['$event'])
  handleTouchStart() {
    // e.preventDefault();
    this.timerId = window.setTimeout(() => {
      this.longpress.emit();
    }, 600);
  }

  @HostListener('touchmove', ['$event'])
  handleTouchMove() {
    // e.preventDefault();
    clearTimeout(this.timerId);

  }

  @HostListener('touchend', ['$event'])
  handleTouchEnd(e: TouchEvent) {
    if (this.timerId) {
      e.preventDefault();
      clearTimeout(this.timerId);
    }
  }

}
