import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { MsToMMSSPipe } from '@app/shared/pipes/ms-to-mmss.pipe';


@Directive({
  standalone: true,
  selector: '[appTimer]',
  providers: [MsToMMSSPipe]
})
export class TimerDirective {
  @Output() timeend = new EventEmitter<void>();
  private id = 0;
  status: 'pending' | 'start' | 'end' = 'pending';

  constructor(
    private el: ElementRef,
    private msToMMSSPipe: MsToMMSSPipe
  ) {
    this.start(1000 * 60 * 3);
  }

  start(time: number) {
    window.clearInterval(this.id);
    const el = this.el.nativeElement as HTMLElement;
    el.innerText = this.msToMMSSPipe.transform(time);
    this.id = window.setInterval(() => {
      (time = time - 1000) <= 0 && this.end();
      el.innerText = this.msToMMSSPipe.transform(time);
    }, 1000);
    this.status = 'start';
  }

  protected end() {
    window.clearInterval(this.id);
    this.id = 0;
    this.timeend.emit();
    this.status = 'end';
  }

}
