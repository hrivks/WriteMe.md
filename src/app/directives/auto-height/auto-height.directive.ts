import { Directive, ElementRef, Input } from '@angular/core';
import { HostListener } from '@angular/core';
declare var $;
@Directive({
  selector: '[appAutoHeight]'
})
export class AutoHeightDirective {

  @Input() minHeight: number;

  constructor(private el: ElementRef) {
    this.minHeight = this.minHeight || 0;
    if (this.minHeight > 0) {
      this.el.nativeElement.style.height = this.minHeight + 'px';
    }
  }

  @HostListener('input', ['$event'])
  keyEvent(e: KeyboardEvent) {
    const height = Math.max(this.el.nativeElement.scrollHeight, this.minHeight);
    this.el.nativeElement.style.height = height + 'px';
  }

}
