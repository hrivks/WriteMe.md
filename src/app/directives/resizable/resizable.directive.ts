import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { ComponentControl } from '../../model/ui-model';
declare var $;

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective implements OnChanges, OnInit {

  @Input() resizeEnabled: boolean;
  @Input() compControl: ComponentControl;
  @Input() aspectRatioLocked: boolean;

  constructor(private el: ElementRef) {

  }

  ngOnInit() {

    if (this.compControl) {
      this.compControl.submit = () => this.submit();
    }

    if (this.resizeEnabled) {
      this.makeResizable();
    }

  }

  ngOnChanges() {

    if (this.compControl) {
      this.compControl.submit = () => this.submit();
    }

    if (this.resizeEnabled) {
      this.makeResizable();
    } else {
      this.removeResizable();
    }

  }

  /** Remove resizable option from selected image */
  removeResizable() {

    if ($(this.el.nativeElement).parent().draggable('instance')) {
      $(this.el.nativeElement).parent().draggable('destroy');
    }
    if ($(this.el.nativeElement).resizable('instance')) {
      $(this.el.nativeElement).resizable('destroy');
    }
    $(this.el.nativeElement).parent().removeAttr('style');
    $(this.el.nativeElement).removeAttr('style');

  }

  /** Make selected image resizable */
  makeResizable() {

    this.removeResizable();
    $(this.el.nativeElement).height('50%');
    $(this.el.nativeElement).resizable({
      containment: 'parent',
      aspectRatio: this.aspectRatioLocked,
      handles: ' n, e, s, w, ne, se, sw, nw',
      maxHeight: 500,
      create: () => {

        $(this.el.nativeElement).parent().draggable({
          containment: 'parent',
          create: () => {

            $(this.el.nativeElement).parent().css('top', '0');
            $(this.el.nativeElement).parent().css('left', '0');

          }
        });

      }
    });

  }

  /** Return the width and height of the resized component */
  submit(): { height: number, width: number } {

    return {
      height: $(this.el.nativeElement).height(),
      width: $(this.el.nativeElement).width()
    };

  }


}
