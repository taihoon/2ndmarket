import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';


@Directive({
  standalone: true,
  selector: '[appIntersectionObserver]'
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;
  private options!: IntersectionObserverInit;
  @Input('appIntersectionObserver') set observerOptions(options: IntersectionObserverInit | undefined | '') {
    const defaultOptions = { root: null, rootMargin: '0px', threshold: 0 };
    this.options = options ? { ...defaultOptions, ...options } :  defaultOptions;
  }
  @Output() intersect = new EventEmitter<IntersectionObserverEntry>();

  constructor(
    private el: ElementRef
  ) {

  }

  ngOnInit() {
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        this.intersect.emit(entry);
      });
    };

    this.observer = new IntersectionObserver(callback, this.options);
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

}
