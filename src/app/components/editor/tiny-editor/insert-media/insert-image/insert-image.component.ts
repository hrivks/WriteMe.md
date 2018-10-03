import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ComponentControl } from '../../../../../model/ui-model';
import { UtilService } from '../../../../../services/utils.service.client';

declare var $;

@Component({
  selector: 'app-insert-image',
  templateUrl: './insert-image.component.html',
  styleUrls: ['./insert-image.component.css']
})
export class InsertImageComponent implements OnInit, OnChanges {

  // properties
  @Input() compControl: ComponentControl;
  @Input() compHeight: number;
  private img: any;
  private aspectRatioLocked: boolean;
  private imgResizeControl: ComponentControl;

  constructor(private utilService: UtilService) {
    this.aspectRatioLocked = true;
    this.img = {};
    this.imgResizeControl = {};
  }

  ngOnInit() {
  }

  ngOnChanges() {

    if (this.compControl) {
      this.compControl.submit = () => this.submit();
      this.compControl.reset = () => this.reset();
    }

  }

  /** Return data */
  submit(): { url: string, title: string } {

    let url = this.img.url;
    if (this.img.customSize) {
      const imgSize = this.imgResizeControl.submit();
      url = this.utilService.getResizedImgUrl(url, imgSize.width, imgSize.height);
    }

    return { url: url, title: this.img.title || '' };

  }

  /** Reset form */
  reset() {

    this.img = {};

  }

}
