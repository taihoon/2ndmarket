import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';


@Directive({
  standalone: true,
  selector: '[appSwipe]'
})
export class SwipeDirective {
  @Output() swipeup = new EventEmitter();
  @Output() swipedown = new EventEmitter();
  private sX = 0;
  private sY = 0;

  constructor(
    private elementRef: ElementRef
  ) {
  }

  @HostListener('touchstart', ['$event'])
  handleTouchStart(e: TouchEvent) {
    this.sX = e.changedTouches[0].screenX;
    this.sY = e.changedTouches[0].screenY;
  }

  @HostListener('touchend', ['$event'])
  handleTouchEnd(e: TouchEvent) {
    e.stopImmediatePropagation();
    const dX = e.changedTouches[0].screenX - this.sX;
    const dY = e.changedTouches[0].screenY - this.sY;
    const rX = Math.abs(dX / dY);
    const rY = Math.abs(dY / dX);

    if (Math.abs(rX > rY ? dX : dY) < 30) {
      return;
    }

    if (rX > rY) {
      if (dX >= 0) {
        // swiperight;
      } else {
        // swipeleft;
      }
    } else {
      if (dY >= 0) {
        this.swipedown.emit();
      } else {
        this.swipeup.emit();
      }
    }
  }

}
